.PHONY: package install

package:
	vsce package

install: package
	code --install-extension "og-gen-$$(cat package.json | jq -r '.version').vsix"
