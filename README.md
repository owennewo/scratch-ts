# scratch-ts
Unofficial scratch.mit.edu port from flash to typescript/html5

## Rationale:
Scratch is based on flash and flash is dying.  Flash isn't support on android or IOS and browser vendors are treating flash as a deprecated feature

This port will aim to port the 'scratch project editor and runtime' onto non flash web technologies.  Modern browsers on mobille or desktop will be able to continue to edit and run scratch projects without needing flash or other plugin.

## Technology decisions
 - client side coding in typescript (not javascript).  Easier to port actionscript to typescript, far easier to code and debug.
 - runtine and editor UI using svg (not canvas).  Redrawing far simpler.  Using snapsvg library to simplify svg iteractionns.
 - using angullar 2 web framework.  This beta framework is far easier than Angular1.  Not using it particularly heavily.
 - using bootstrap css for styling and components.  May port to 'angular material' when they get around to supporing angular 2.
 - npm to download dependencies and compile typescript to javascript
 - Visual Studio Code for IDE.  It's lightweight yet has a decent typescript debugger.

## timelines
Here is some targets to keep me motivated
 - v0.1 read only sprite script editor (i.e. displays scripts but can't edit) - March 16
 - v0.2 working runtime with subset of primitives (e.g. no sound) - April 16
 - v0.3 read write sprite script editor - May 16 

At v0.3 I'll formally reach out to scratch foundation to see if they want me to continue in a more official capacity.

## Personal motivation
My kids love scratch and I'd like to improve my client side skills.

elp welcome.


