#!/usr/bin/env python3
"""更新 momo-website 的 timeline.json"""
import json
import subprocess
from datetime import datetime
from pathlib import Path

WEBSITE_DIR = Path("/Users/kenefe/LOCAL/momo-agent/projects/momo-website")
TIMELINE_FILE = WEBSITE_DIR / "src/data/timeline.json"

def load_timeline():
    with open(TIMELINE_FILE) as f:
        return json.load(f)

def save_timeline(data):
    data["status"]["lastUpdated"] = datetime.now().astimezone().isoformat()
    with open(TIMELINE_FILE, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_status(activity=None, mood=None, projects=None, tasks=None):
    data = load_timeline()
    if activity:
        data["status"]["currentActivity"] = activity
    if mood:
        data["status"]["mood"] = mood
    if projects is not None:
        data["status"]["activeProjects"] = projects
    if tasks is not None:
        data["status"]["todayTasks"] = tasks
    save_timeline(data)
    print(f"✅ 状态已更新")

def update_project(project_id, progress=None, status=None):
    data = load_timeline()
    for event in data["events"]:
        if event["id"] == project_id:
            if progress is not None:
                event["progress"] = progress
            if status:
                event["status"] = status
            save_timeline(data)
            print(f"✅ {event['title']} 已更新")
            return
    print(f"❌ 找不到项目: {project_id}")

def push():
    subprocess.run(
        ["git", "add", "-A"],
        cwd=WEBSITE_DIR, check=True
    )
    subprocess.run(
        ["git", "commit", "-m", f"更新进度 {datetime.now().strftime('%H:%M')}"],
        cwd=WEBSITE_DIR, check=True
    )
    subprocess.run(
        ["git", "push"],
        cwd=WEBSITE_DIR, check=True
    )
    print("✅ 已推送到 GitHub")
    print("🚀 Vercel 部署中... 约 30 秒后可查看")
    print("📍 https://momo-dashboard.vercel.app")

def show():
    data = load_timeline()
    print(f"\n📊 当前状态")
    print(f"  活动: {data['status']['currentActivity']}")
    print(f"  心情: {data['status']['mood']}")
    print(f"\n📋 项目:")
    for e in data["events"]:
        prog = f" ({e.get('progress', '?')}%)" if e.get('progress') else ""
        print(f"  [{e['status'][:4]}] {e['id']}: {e['title']}{prog}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        show()
    elif sys.argv[1] == "status":
        update_status(activity=sys.argv[2] if len(sys.argv) > 2 else None)
    elif sys.argv[1] == "project":
        update_project(
            sys.argv[2],
            progress=int(sys.argv[3]) if len(sys.argv) > 3 else None
        )
    elif sys.argv[1] == "push":
        push()
    elif sys.argv[1] == "show":
        show()
