# Quick Start: Connect Source to Icecast

Your Icecast server is running! Now you need to connect a source client to actually stream audio.

## Current Status ✅

- ✅ Icecast server running on `localhost:8000`
- ✅ Admin interface accessible
- ✅ Configuration updated
- ⏳ **Need:** Source client connected to stream audio

## Option 1: Test with BUTT (Easiest)

### Download BUTT
1. Go to: https://www.butt.tuxfamily.org/
2. Download Windows version
3. Install it

### Configure BUTT

1. **Open BUTT**
2. **Click "Settings"**
3. **Main Tab:**
   - Server: `localhost`
   - Port: `8000`
   - Password: (your source password from icecast.xml)
   - Username: `source` (important!)
   - Mount Point: `/stream`

4. **Audio Tab:**
   - Select your audio input (microphone, system audio, etc.)
   - Or select "File" to stream from an audio file

5. **Click "OK"**
6. **Click "Connect"** in BUTT
7. You should see "Connected" status

### Test Stream

1. Open browser: `http://localhost:8000/stream`
2. You should see stream info
3. Open Flam Tunes player: `http://localhost:3000`
4. Click play - you should hear audio!

## Option 2: Test with OBS Studio

1. **Download OBS Studio:** https://obsproject.com/
2. **Install and open OBS**
3. **Add Source:**
   - Click "+" → "Audio Input Capture" or "Audio Output Capture"
4. **Settings → Stream:**
   - Service: Custom
   - Server: `http://localhost:8000/stream`
   - Stream Key: (leave empty or use your source password)
5. **Start Streaming**

## Option 3: Test with VLC (Quick Test)

1. **Open VLC Media Player**
2. **Media → Stream**
3. **Add a file** (any MP3)
4. **Click "Stream"**
5. **Destination:**
   - New destination: Icecast
   - Address: `localhost`
   - Port: `8000`
   - Mount Point: `/stream`
   - Password: (your source password)
   - Username: `source`
6. **Click "Stream"**

## Verify Source is Connected

1. Go to Icecast Admin: `http://localhost:8000/admin/`
2. Click "Mountpoint List"
3. You should see `/stream` listed with:
   - Source connected
   - Listeners: (number of people listening)
   - Bitrate, etc.

## Update Flam Tunes

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_ICECAST_STREAM_URL=http://localhost:8000/stream
ICECAST_STREAM_URL=http://localhost:8000/stream
```

Then restart your Flam Tunes dev server:
```bash
pnpm dev
```

## Troubleshooting

### "Authentication failed" in source client
- Check username is exactly `source` (lowercase)
- Verify password matches what's in `icecast.xml`
- Make sure you edited the right config file

### Stream shows but no audio
- Check source client is actually playing/streaming
- Verify audio input is selected correctly
- Check Icecast mountpoint list shows source connected

### Flam Tunes player won't connect
- Verify Icecast is running
- Check stream URL in `.env.local` is correct
- Make sure a source is connected (check admin interface)
- Restart Flam Tunes dev server after changing `.env.local`

---

**Once you have a source connected, your Flam Tunes radio station will be live!** 🎵

