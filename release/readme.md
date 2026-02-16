gh release create v1.2.3 \
  --title "BackWatcher v1.2.3 - macOS release - Signed and Notarized" \
  --notes "Click on download BackWatcher-1.2.3-arm64.dmg" \
  release/BackWatcher-1.2.3-arm64.dmg \

git add -- . ':!release'



gh release delete v1.2.4 --yes
gh release create v1.2.4 --title "BackWatcher v1.2.4 - macOS release - Signed and Notarized" --notes "Click on download BackWatcher-1.x.x-arm64.dmg" release/BackWatcher-1.2.4-arm64.dmg
