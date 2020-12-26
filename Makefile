package:
	vsce package

publish:
	vsce login bilalekrem
	vsce publish

install_deps:
	npm install -g vsce