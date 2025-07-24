[app]

# App details
title = Weather Display App
package.name = weatherdisplay
package.domain = com.mohammadaminalbooyeh
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 0.1

# Dependencies
requirements = python3,kivy,requests

# App orientation and fullscreen settings
orientation = portrait
fullscreen = 0

# OSX-specific settings (optional)
osx.python_version = 3
osx.kivy_version = 2.3.0

# Android settings
android.api = 33
android.minapi = 21
android.ndk_api = 33
android.permissions = INTERNET

# Use AAB output (recommended for Google Play)
android.release_artifact = aab

# Enable AndroidX support
android.enable_androidx = True

# Enable UTF-8 support for assets
android.encode_assets = True

# Uncomment and set these if you have app icon or presplash image
# icon.filename = %(source.dir)s/data/icon.png
# presplash.filename = %(source.dir)s/data/presplash.png
