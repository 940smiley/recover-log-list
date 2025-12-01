import os
import threading
import time
from ultralytics import YOLO
import shutil

class TrainingService:
    def __init__(self):
        self.is_training = False
        self.status = "idle"
        self.progress = 0
        self.current_epoch = 0
        self.total_epochs = 0
        self.logs = []
        self.model = None
        self.stop_event = threading.Event()
        self.thread = None

    def start_training(self, data_path: str, epochs: int = 10, batch_size: int = 16, model_name: str = "yolov8n.pt"):
        if self.is_training:
            raise Exception("Training is already in progress")

        self.is_training = True
        self.status = "starting"
        self.progress = 0
        self.current_epoch = 0
        self.total_epochs = epochs
        self.logs = []
        self.stop_event.clear()

        self.thread = threading.Thread(
            target=self._train_process,
            args=(data_path, epochs, batch_size, model_name)
        )
        self.thread.start()

    def stop_training(self):
        if not self.is_training:
            return
        
        self.status = "stopping"
        self.stop_event.set()
        # Note: YOLOv8 doesn't have a clean "stop" method for the train loop exposed easily 
        # without custom callbacks, but we can flag it. 
        # For now, we might just have to wait or kill the process if we were using multiprocessing.
        # Since we are using threading, we rely on the loop checking the flag if we were writing a custom loop.
        # But ultralytics train() is blocking. 
        # We can't easily interrupt it safely from a thread without killing the app or using a subprocess.
        # For this MVP, "stop" might just update status and let it finish or require restart.
        # A better approach for production is running training in a separate process.
        
        self.logs.append("Stop requested. Training will stop after current operation or requires restart.")
        self.is_training = False # Force flag
        self.status = "stopped"

    def _train_process(self, data_path: str, epochs: int, batch_size: int, model_name: str):
        try:
            self.status = "training"
            self.logs.append(f"Starting training with model {model_name} on {data_path}")
            
            # Initialize model
            self.model = YOLO(model_name)
            
            # Add a custom callback to track progress if possible, 
            # or just run it and assume it works.
            # Ultralytics supports callbacks.
            
            def on_train_epoch_end(trainer):
                self.current_epoch = trainer.epoch + 1
                self.progress = (self.current_epoch / self.total_epochs) * 100
                self.logs.append(f"Epoch {self.current_epoch}/{self.total_epochs} completed")
                
                if self.stop_event.is_set():
                    raise InterruptedError("Training stopped by user")

            self.model.add_callback("on_train_epoch_end", on_train_epoch_end)

            # Run training
            # data_path should be a yaml file
            results = self.model.train(
                data=data_path,
                epochs=epochs,
                batch=batch_size,
                imgsz=640,
                project="../data/training_runs",
                name="custom_run",
                exist_ok=True # Overwrite existing run for simplicity in this MVP
            )
            
            self.status = "completed"
            self.progress = 100
            self.logs.append("Training completed successfully")
            
        except InterruptedError:
            self.status = "stopped"
            self.logs.append("Training stopped")
        except Exception as e:
            self.status = "error"
            self.logs.append(f"Error: {str(e)}")
            print(f"Training error: {e}")
        finally:
            self.is_training = False

    def get_status(self):
        return {
            "is_training": self.is_training,
            "status": self.status,
            "progress": self.progress,
            "current_epoch": self.current_epoch,
            "total_epochs": self.total_epochs,
            "logs": self.logs[-50:] # Return last 50 logs
        }

training_service = TrainingService()
