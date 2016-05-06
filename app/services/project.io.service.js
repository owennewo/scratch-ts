System.register(["../model/stage.model", "../model/sprite.model", "../model/project.detail.model", "../model/script.model", "../model/sound.model", "../model/costume.model", "./block.io.service"], function(exports_1) {
    var stage_model_1, sprite_model_1, project_detail_model_1, script_model_1, sound_model_1, costume_model_1, block_io_service_1;
    var ProjectIOService;
    return {
        setters:[
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            },
            function (project_detail_model_1_1) {
                project_detail_model_1 = project_detail_model_1_1;
            },
            function (script_model_1_1) {
                script_model_1 = script_model_1_1;
            },
            function (sound_model_1_1) {
                sound_model_1 = sound_model_1_1;
            },
            function (costume_model_1_1) {
                costume_model_1 = costume_model_1_1;
            },
            function (block_io_service_1_1) {
                block_io_service_1 = block_io_service_1_1;
            }],
        execute: function() {
            ProjectIOService = (function () {
                function ProjectIOService() {
                }
                ProjectIOService.prototype.readProjectDetail = function (jsonInfo) {
                    var detail = new project_detail_model_1.ProjectDetailModel();
                    detail.creator.username = jsonInfo.creator.username;
                    detail.creator.userprofile.bio = jsonInfo.creator.userprofile.bio;
                    detail.creator.userprofile.status = jsonInfo.creator.userprofile.status;
                    detail.creator.userprofile.country = jsonInfo.creator.userprofile.country;
                    detail.dateTimeShared = jsonInfo.datetime_shared;
                    detail.description = jsonInfo.description;
                    detail.favoriteCount = jsonInfo.favorite_count;
                    detail.id = jsonInfo.id;
                    detail.loveCount = jsonInfo.love_count;
                    detail.resourceUri = jsonInfo.resource_uri;
                    detail.thumbnail = jsonInfo.thumbnail;
                    detail.title = jsonInfo.title;
                    detail.viewCount = jsonInfo.view_count;
                    console.log("todo display project info:" + detail.title);
                    return detail;
                };
                ProjectIOService.prototype.readProject = function (jsonStage, projectID) {
                    var stage = new stage_model_1.StageModel();
                    this.readObject(stage, stage, jsonStage);
                    stage.tempo = jsonStage.tempoBPM;
                    stage.videoAlpha = jsonStage.videoAlpha;
                    stage.children = this.readSprites(jsonStage.children, stage);
                    stage.info = this.readProjectInfo(jsonStage.info);
                    stage.id = projectID;
                    return stage;
                };
                ProjectIOService.prototype.readObject = function (stage, object, jsonProject) {
                    object.name = jsonProject.objName;
                    object.scripts = this.readScripts(jsonProject.scripts);
                    object.sounds = this.readSounds(jsonProject.sounds, stage);
                    object.costumes = this.readCostumes(jsonProject.costumes);
                    object.currentCostumeIndex = jsonProject.currentCostumeIndex;
                };
                /** SPRITES READ */
                ProjectIOService.prototype.readSprites = function (jsonSprites, stage) {
                    var sprites = [];
                    for (var _i = 0; _i < jsonSprites.length; _i++) {
                        var jsonSprite = jsonSprites[_i];
                        if (!jsonSprite.objName) {
                            console.log("warning: child is not a sprite! (probably target)");
                            continue;
                        }
                        var sprite = new sprite_model_1.SpriteModel(stage);
                        this.readObject(stage, sprite, jsonSprite);
                        sprite.x = jsonSprite.scratchX;
                        sprite.y = jsonSprite.scratchY;
                        sprite.scale = jsonSprite.scale;
                        sprite.direction = jsonSprite.direction;
                        sprite.rotationStyle = jsonSprite.rotationStyle;
                        sprite.isDraggable = jsonSprite.isDraggable;
                        sprite.indexInLibrary = jsonSprite.indexInLibrary;
                        sprite.visible = jsonSprite.visible;
                        sprite.info = jsonSprite.spriteInfo;
                        sprites.push(sprite);
                    }
                    return sprites;
                };
                /** SCRIPT READ */
                ProjectIOService.prototype.readScripts = function (jsonScripts) {
                    var scripts = [];
                    var index = 0;
                    if (!jsonScripts)
                        return scripts;
                    for (var _i = 0; _i < jsonScripts.length; _i++) {
                        var jsonScript = jsonScripts[_i];
                        var script = new script_model_1.ScriptModel();
                        script.index = index;
                        script.x = jsonScript[0];
                        script.y = jsonScript[1];
                        script.index = index;
                        script.firstBlock = block_io_service_1.BlockIOService.arrayToStack(jsonScript[2]);
                        scripts.push(script);
                        index++;
                    }
                    return scripts;
                };
                /** SOUND READ */
                ProjectIOService.prototype.readSounds = function (jsonSounds, stage) {
                    var sounds = [];
                    if (!jsonSounds)
                        return sounds;
                    for (var _i = 0; _i < jsonSounds.length; _i++) {
                        var jsonSound = jsonSounds[_i];
                        var sound = new sound_model_1.SoundModel(stage);
                        sound.id = jsonSound.soundID;
                        sound.name = jsonSound.soundName;
                        sound.md5 = jsonSound.md5;
                        sound.sampleCount = jsonSound.sampleCount;
                        sound.rate = jsonSound.rate;
                        sound.format = jsonSound.format;
                        sounds.push(sound);
                    }
                    return sounds;
                };
                /** SOUND READ */
                ProjectIOService.prototype.readCostumes = function (jsonCostumes) {
                    var costumes = [];
                    if (!jsonCostumes)
                        return costumes;
                    for (var _i = 0; _i < jsonCostumes.length; _i++) {
                        var jsonCostume = jsonCostumes[_i];
                        var costume = new costume_model_1.CostumeModel();
                        costume.id = jsonCostume.baseLayerID;
                        costume.name = jsonCostume.costumeName;
                        costume.md5 = jsonCostume.baseLayerMD5;
                        costume.resolution = jsonCostume.bitmapResolution;
                        costume.centerX = jsonCostume.rotationCenterX;
                        costume.centerY = jsonCostume.rotationCenterY;
                        costumes.push(costume);
                    }
                    return costumes;
                };
                /** PROJECT INFO READ */
                ProjectIOService.prototype.readProjectInfo = function (jsonInfo) {
                    var info = new stage_model_1.ProjectInfoModel();
                    info.id = jsonInfo.projectID;
                    info.flashVersion = jsonInfo.flashVersion;
                    info.hasCloudData = jsonInfo.hasCloudData;
                    info.scriptCount = jsonInfo.scriptCount;
                    info.videoOn = jsonInfo.videoOn;
                    info.scratchVersion = jsonInfo.swfVersion;
                    info.spriteCount = jsonInfo.spriteCount;
                    info.userAgent = jsonInfo.userAgent;
                    return info;
                };
                return ProjectIOService;
            })();
            exports_1("ProjectIOService", ProjectIOService);
        }
    }
});
//# sourceMappingURL=project.io.service.js.map