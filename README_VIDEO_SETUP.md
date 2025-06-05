# Video Intro Setup for Brain Battle

## Adding Your Intro Video

1. **Place your video file in the `public` folder**:
   - Copy your video file to `/public/intro-video.mp4`
   - Supported formats: MP4, WebM
   - For best compatibility, use MP4 format

2. **Video Recommendations**:
   - Resolution: 1920x1080 (Full HD) or 1280x720 (HD)
   - Duration: 10-30 seconds for best user experience
   - File size: Keep under 10MB for faster loading
   - Format: H.264 codec for MP4

3. **File Structure**:
   ```
   brain-battle/
   ├── public/
   │   ├── intro-video.mp4    ← Place your video here
   │   └── intro-video.webm   ← Optional: WebM version for better compression
   ├── src/
   └── ...
   ```

## Features

- **Auto-play**: Video starts automatically when the app loads
- **Skip button**: Users can skip after 3 seconds
- **Video controls**: Play/pause, progress bar, time display
- **Fallback**: Shows animated Brain Battle logo if no video is found
- **Responsive**: Works on desktop and mobile devices

## Customization

### Change Video Path
Edit `src/components/VideoIntro.tsx`, lines 67-68:
```tsx
<source src="/your-video-name.mp4" type="video/mp4" />
<source src="/your-video-name.webm" type="video/webm" />
```

### Adjust Skip Timer
Edit `src/components/VideoIntro.tsx`, line 17:
```tsx
const timer = setTimeout(() => {
  setCanSkip(true);
}, 3000); // Change 3000 to desired milliseconds
```

### Disable Intro (for development)
Edit `src/App.tsx`, line 12:
```tsx
const [showIntro, setShowIntro] = useState(false); // Change to false
```

## Testing

1. Place a video file at `/public/intro-video.mp4`
2. Run `npm run dev`
3. Open the app - the intro should play first
4. Test the skip button and video controls

## Troubleshooting

**Video doesn't play:**
- Check the file path is correct (`/public/intro-video.mp4`)
- Ensure the video file isn't corrupted
- Try a different video format

**Video is too large:**
- Compress the video using tools like HandBrake or FFmpeg
- Consider reducing resolution or frame rate

**Auto-play blocked:**
- Some browsers block auto-play with sound
- Videos will auto-play but may be muted initially
- Users can unmute or interact to enable sound 