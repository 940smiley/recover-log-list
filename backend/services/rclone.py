import subprocess
import json
from typing import List, Dict, Any

class RcloneService:
    def __init__(self, rclone_path: str = "rclone"):
        self.rclone_path = rclone_path

    def _run_command(self, args: List[str]) -> Any:
        try:
            result = subprocess.run(
                [self.rclone_path] + args,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"Rclone error: {e.stderr}")
            raise Exception(f"Rclone command failed: {e.stderr}")
        except FileNotFoundError:
             raise Exception("Rclone executable not found. Please install rclone and add it to your PATH.")

    def list_remotes(self) -> List[str]:
        output = self._run_command(["listremotes"])
        return [line.strip() for line in output.splitlines() if line.strip()]

    def list_files(self, remote: str, path: str = "") -> List[Dict[str, Any]]:
        # Use lsjson for structured output
        output = self._run_command(["lsjson", f"{remote}{path}"])
        return json.loads(output)

    def copy_file(self, source: str, dest: str):
        self._run_command(["copy", source, dest])

rclone_service = RcloneService()
