# Icecast Setup Guide for Flam Tunes

This guide will help you set up Icecast streaming server for Flam Tunes.

## What is Icecast?

Icecast is a streaming media server that broadcasts audio streams over the internet. It's what will actually stream your radio station to listeners.

## Installation

### Windows

1. Download Icecast from: https://icecast.org/download/
2. Extract to a folder (e.g., `C:\icecast`)
3. The configuration file is `icecast.xml` in the installation directory

### Linux/Mac

```bash
# Ubuntu/Debian
sudo apt-get install icecast2

# macOS (with Homebrew)
brew install icecast

# Or download from https://icecast.org/download/
```

## Configuration

### Step 1: Secure Your Passwords

**IMPORTANT**: Change all default passwords in `icecast.xml`:

```xml
<authentication>
    <source-password>YOUR_SECURE_SOURCE_PASSWORD</source-password>
    <relay-password>YOUR_SECURE_RELAY_PASSWORD</relay-password>
    <admin-user>admin</admin-user>
    <admin-password>YOUR_SECURE_ADMIN_PASSWORD</admin-password>
</authentication>
```

**Generate secure passwords** (use a password manager or generate random strings).

### Step 2: Configure Hostname

If you're deploying to a server, update the hostname:

```xml
<hostname>your-domain.com</hostname>
<!-- Or use your server's IP address -->
```

For local development:
```xml
<hostname>localhost</hostname>
```

### Step 3: Configure Port

Default port is 8000. Make sure it's not blocked by firewall:

```xml
<listen-socket>
    <port>8000</port>
    <!-- For production, you might want to bind to specific IP -->
    <!-- <bind-address>0.0.0.0</bind-address> -->
</listen-socket>
```

### Step 4: Set Up Mount Point

A mount point is where your stream will be accessible. The default is `/stream`:

Your stream URL will be: `http://your-hostname:8000/stream`

You can customize it by adding a mount section:

```xml
<mount type="normal">
    <mount-name>/stream</mount-name>
    <public>1</public>
    <max-listeners>100</max-listeners>
</mount>
```

### Step 5: Update Flam Tunes Environment

Add to your `.env.local`:

```env
# Icecast Configuration
NEXT_PUBLIC_ICECAST_STREAM_URL=http://localhost:8000/stream
ICECAST_STREAM_URL=http://localhost:8000/stream

# Icecast Source Credentials (for your orchestrator service)
ICECAST_SOURCE_PASSWORD=YOUR_SECURE_SOURCE_PASSWORD
ICECAST_HOST=localhost
ICECAST_PORT=8000
ICECAST_MOUNT=/stream
```

## Running Icecast

### Windows

1. Open Command Prompt or PowerShell
2. Navigate to Icecast directory:
   ```cmd
   cd C:\icecast
   ```
3. Run Icecast:
   ```cmd
   icecast.exe -c icecast.xml
   ```

Or create a batch file `start-icecast.bat`:
```batch
@echo off
cd /d C:\icecast
icecast.exe -c icecast.xml
pause
```

### Linux/Mac

```bash
# Run in foreground
icecast -c /path/to/icecast.xml

# Or as a service (systemd)
sudo systemctl start icecast
sudo systemctl enable icecast
```

## Testing Your Setup

### 1. Check Icecast is Running

Open in browser: `http://localhost:8000`

You should see the Icecast status page.

### 2. Test Stream Connection

The stream won't work until you have a source connected, but you can verify the mount point exists at:
`http://localhost:8000/stream`

### 3. Admin Interface

Access admin at: `http://localhost:8000/admin/`

Login with:
- Username: `admin`
- Password: (your admin password)

## Connecting a Source

To actually stream audio, you need a source client. Options:

### Option 1: Use a Source Client (for testing)

**BUTT (Broadcast Using This Tool)** - Free, cross-platform
- Download: https://www.butt.tuxfamily.org/
- Configure:
  - Server: `localhost` (or your server IP)
  - Port: `8000`
  - Mount Point: `/stream`
  - Password: (your source password)
  - Username: `source`

**OBS Studio** - Free, cross-platform
- Install OBS Studio
- Add "Icecast" output
- Configure with your Icecast credentials

### Option 2: Build Your Own Source Client

You'll need to create a service that:
1. Connects to Icecast using the source password
2. Sends audio data to the mount point
3. Updates metadata (now playing info)

This is typically done by your "radio orchestrator" service.

## Production Deployment

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong, unique passwords
- [ ] Configure firewall (allow port 8000)
- [ ] Use HTTPS if possible (configure SSL)
- [ ] Set up proper hostname
- [ ] Configure CORS headers if needed
- [ ] Set appropriate listener limits
- [ ] Enable logging and monitoring

### Firewall Configuration

**Windows Firewall:**
```cmd
netsh advfirewall firewall add rule name="Icecast" dir=in action=allow protocol=TCP localport=8000
```

**Linux (UFW):**
```bash
sudo ufw allow 8000/tcp
```

**Linux (iptables):**
```bash
sudo iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
```

### SSL/HTTPS Setup (Optional but Recommended)

1. Get SSL certificate (Let's Encrypt, etc.)
2. Update Icecast config:
```xml
<listen-socket>
    <port>8443</port>
    <ssl>1</ssl>
</listen-socket>
<paths>
    <ssl-certificate>/path/to/icecast.pem</ssl-certificate>
</paths>
```

## Integration with Flam Tunes

### Current Setup

Flam Tunes is configured to connect to Icecast for playback. The public player at `/` will connect to the stream URL you configure.

### Future: Radio Orchestrator

You'll need to build a separate service (radio orchestrator) that:
1. Reads your database (shows, tracks, segments)
2. Manages playlists and scheduling
3. Connects to Icecast as a source
4. Streams audio files
5. Updates now-playing information
6. Calls `/api/internal/now-playing` to update Flam Tunes database

This orchestrator would:
- Use `ICECAST_SOURCE_PASSWORD` to authenticate
- Connect to `ICECAST_HOST:ICECAST_PORT`
- Stream to mount point `ICECAST_MOUNT`
- Handle transitions between tracks, segments, shows

## Troubleshooting

### Icecast Won't Start

- Check if port 8000 is already in use
- Verify configuration file syntax (XML must be valid)
- Check error log: `log/error.log`

### Can't Connect to Stream

- Verify Icecast is running
- Check firewall settings
- Ensure source is connected (stream won't work without a source)
- Check mount point URL is correct

### Authentication Errors

- Verify source password is correct
- Check username is `source` (not `admin`)
- Ensure passwords don't have special characters that need escaping

### Stream Not Playing in Browser

- Check browser console for errors
- Verify CORS headers are set (already configured in your config)
- Ensure stream URL is correct in `.env.local`
- Make sure a source is actually streaming

## Recommended Configuration for Flam Tunes

Here's a production-ready configuration snippet:

```xml
<icecast>
    <location>Flam Tunes Radio Station</location>
    <admin>admin@flamtunes.com</admin>
    <hostname>your-domain.com</hostname>
    
    <limits>
        <clients>500</clients>
        <sources>2</sources>
        <queue-size>524288</queue-size>
        <client-timeout>30</client-timeout>
        <header-timeout>15</header-timeout>
        <source-timeout>10</source-timeout>
        <burst-on-connect>1</burst-on-connect>
        <burst-size>65535</burst-size>
    </limits>
    
    <authentication>
        <source-password>CHANGE_THIS_SECURE_PASSWORD</source-password>
        <relay-password>CHANGE_THIS_SECURE_PASSWORD</relay-password>
        <admin-user>admin</admin-user>
        <admin-password>CHANGE_THIS_SECURE_PASSWORD</admin-password>
    </authentication>
    
    <listen-socket>
        <port>8000</port>
        <bind-address>0.0.0.0</bind-address>
    </listen-socket>
    
    <mount type="normal">
        <mount-name>/stream</mount-name>
        <public>1</public>
        <max-listeners>500</max-listeners>
    </mount>
    
    <http-headers>
        <header name="Access-Control-Allow-Origin" value="*" />
    </http-headers>
</icecast>
```

## Next Steps

1. ✅ Install Icecast
2. ✅ Configure passwords and hostname
3. ✅ Start Icecast server
4. ✅ Update Flam Tunes `.env.local` with stream URL
5. ⏳ Set up source client (for testing) or build orchestrator
6. ⏳ Test stream playback in Flam Tunes player
7. ⏳ Deploy to production server

## Resources

- Icecast Documentation: http://icecast.org/docs/
- Icecast Configuration Reference: http://icecast.org/docs/icecast-2.4.1/config-file.html
- BUTT Source Client: https://www.butt.tuxfamily.org/
- OBS Studio: https://obsproject.com/

---

**Note**: Icecast only streams - it doesn't play files. You need a source client to send audio to Icecast, which then broadcasts it to listeners.

