import {ProjectModel} from './project.model';
import {describe, it, beforeEach, expect} from 'angular2/testing';

describe('project.model', () => {
	
	var initial: ProjectModel = new ProjectModel();
	initial.tempo = 60;
	initial.videoAlpha = 1.0;
	var duplicate = initial.duplicate();
	
	describe('duplicate checks', () => 
	{
		it('duplicate has different reference', () => expect(initial).not.toBe(duplicate));
		it('duplicate has same tempo', () => expect(initial.tempo).toEqual(duplicate.tempo))
		it('duplicate has same videoAlpha', () => expect(initial.videoAlpha).toEqual(duplicate.videoAlpha));
	});

});
