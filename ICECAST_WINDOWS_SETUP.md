# Icecast Windows Setup for Flam Tunes

## Your Icecast Installation

**Installation Location:** `C:\Program Files (x86)\Icecast`

**Key Files:**
- Executable: `C:\Program Files (x86)\Icecast\bin\icecast.exe`
- Config File: `C:\Program Files (x86)\Icecast\icecast.xml`
- Batch File: `C:\Program Files (x86)\Icecast\icecast.bat`

## Step 1: Configure Icecast

### Option A: Edit Config File Directly (Requires Admin)

1. **Open Notepad as Administrator:**
   - Right-click on Start Menu
   - Click "Windows Terminal (Admin)" or "Command Prompt (Admin)"
   - Or search for "Notepad", right-click, "Run as administrator"

2. **Open the config file:**
   - File → Open
   - Navigate to: `C:\Program Files (x86)\Icecast\icecast.xml`
   - Change file type filter to "All Files (*.*)"

3. **Change the passwords** (IMPORTANT!):
   - Find `<source-password>hackme</source-password>`
   - Replace `hackme` with a secure password (save this!)
   - Find `<relay-password>hackme</relay-password>`
   - Replace `hackme` with a secure password
   - Find `<admin-password>hackme</admin-password>`
   - Replace `hackme` with a secure password

4. **Update location and admin email:**
   ```xml
   <location>Flam Tunes Radio Station</location>
   <admin>admin@flamtunes.com</admin>
   ```

5. **Keep hostname as localhost for now:**
   ```xml
   <hostname>localhost</hostname>
   ```

6. **Save the file**

### Option B: Copy Config to User Directory (Easier)

1. Copy `icecast.xml` to your user directory:
   ```powershell
   Copy-Item "C:\Program Files (x86)\Icecast\icecast.xml" "$env:USERPROFILE\icecast.xml"
   ```

2. Edit the copy in your user directory (no admin needed)

3. Run Icecast with custom config:
   ```powershell
   & "C:\Program Files (x86)\Icecast\bin\icecast.exe" -c "$env:USERPROFILE\icecast.xml"
   ```

## Step 2: Start Icecast

### Method 1: Using the Batch File

1. Open Command Prompt or PowerShell
2. Navigate to Icecast directory:
   ```cmd
   cd "C:\Program Files (x86)\Icecast"
   ```
3. Run:
   ```cmd
   icecast.bat
   ```

### Method 2: Direct Command

```powershell
& "C:\Program Files (x86)\Icecast\bin\icecast.exe" -c "C:\Program Files (x86)\Icecast\icecast.xml"
```

### Method 3: Create a Desktop Shortcut

1. Right-click on desktop → New → Shortcut
2. Target:
   ```
   "C:\Program Files (x86)\Icecast\bin\icecast.exe" -c "C:\Program Files (x86)\Icecast\icecast.xml"
   ```
3. Name it "Start Icecast"
4. Double-click to run

## Step 3: Verify Icecast is Running

1. Open browser: `http://localhost:8000`
2. You should see the Icecast status page
3. Admin interface: `http://localhost:8000/admin/`
   - Username: `admin`
   - Password: (the one you set)

## Step 4: Update Flam Tunes Configuration

Add to your `.env.local` file:

```env
# Icecast Stream URL
NEXT_PUBLIC_ICECAST_STREAM_URL=http://localhost:8000/stream
ICECAST_STREAM_URL=http://localhost:8000/stream

# Icecast Source Credentials (for future orchestrator)
ICECAST_SOURCE_PASSWORD=your_source_password_here
ICECAST_HOST=localhost
ICECAST_PORT=8000
ICECAST_MOUNT=/stream
```

## Step 5: Test the Connection

1. Make sure Icecast is running
2. Start your Flam Tunes app: `pnpm dev`
3. Go to `http://localhost:3000`
4. The player should show (but won't play until you have a source connected)

## Important Notes

⚠️ **Icecast needs a source to stream!** The player will connect, but you won't hear anything until:
- You connect a source client (like BUTT or OBS), OR
- You build a radio orchestrator service

### Quick Test with Source Client

**BUTT (Broadcast Using This Tool):**
1. Download: https://www.butt.tuxfamily.org/
2. Configure:
   - Server: `localhost`
   - Port: `8000`
   - Mount Point: `/stream`
   - Password: (your source password)
   - Username: `source`
3. Click "Connect" and play some audio

## Troubleshooting

### "Access Denied" when editing config
- Run Notepad as Administrator
- Or use Option B (copy to user directory)

### Port 8000 already in use
- Check if Icecast is already running
- Or change port in `icecast.xml`:
  ```xml
  <listen-socket>
      <port>8001</port>
  </listen-socket>
  ```
- Update Flam Tunes `.env.local` accordingly

### Can't access http://localhost:8000
- Check Windows Firewall
- Make sure Icecast is actually running (check Task Manager)
- Check error log: `C:\Program Files (x86)\Icecast\log\error.log`

### Stream URL not working
- Make sure a source is connected to Icecast
- Check mount point is `/stream`
- Verify CORS headers are set (should be in default config)

## Next Steps

1. ✅ Configure passwords
2. ✅ Start Icecast
3. ✅ Update Flam Tunes `.env.local`
4. ⏳ Connect a source client for testing
5. ⏳ Build radio orchestrator service (future)

---

**Your Icecast is ready!** Once you have a source connected, your Flam Tunes player will be able to stream audio.

