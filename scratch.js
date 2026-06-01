import YTDlpWrapModule from 'yt-dlp-wrap'
const ytDlp = new (YTDlpWrapModule.default || YTDlpWrapModule)()
ytDlp.execPromise([
  `ytsearch1:Rick Astley Never Gonna Give You Up`,
  '--get-title',
  '--get-url',
  '--get-thumbnail',
  '--get-duration',
  '--no-playlist',
  '-f', 'bestaudio/best',
  '--no-warnings'
]).then(out => {
  console.log("OUTPUT:")
  console.log(out)
})
