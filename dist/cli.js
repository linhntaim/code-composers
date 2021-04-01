"use strict";var _helpers=require("yargs/helpers");var _yargs=_interopRequireDefault(require("yargs"));var _pug=require("./pug");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var argv=(0,_yargs["default"])((0,_helpers.hideBin)(process.argv)).option("composer",{alias:"c",type:"string"}).option("source",{alias:"s",type:"string"}).option("destination",{alias:"d",type:"string"}).argv;var Composer=null;switch(argv.c){case"pug":Composer=_pug.PugComposer;break;default:console.log("Please provide the composer (--composer|--c) in the command.");process.exit(1);break;}if(!argv.s){console.log("Please provide the source (--source|--s) in the command.");process.exit(1)}try{Composer&&new Composer().composeFile(argv.s,argv.d)}catch(e){console.log(e);process.exit(1)}
//# sourceMappingURL=cli.js.map