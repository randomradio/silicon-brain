VERSION ?= 0.0.1

change-version:
		sed -i -e "s/\"version\": \".*\"/\"version\": \"$(VERSION)\"/" src-tauri/tauri.conf.json
		sed -i -e "s/\"version\": \".*\"/\"version\": \"$(VERSION)\"/" package.json
