/*
 * Scratch Project Editor and Player
 * Copyright (C) 2015 Massachusetts Institute of Technology
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

//module logging {
//import Capabilities = flash.system.Capabilities;

//import JSON = util.JSON;
import {LogLevel} from './LogLevel';


export class Log {

	logBuffer = []

	constructor() {
		
	}
	
	private static _LOG = new Log();

	// Add a new entry to the log.
	public log(severity:string, message:string, extraData?:any) {
		
		var log = {severity: severity, message: message, extraData: extraData};
		console.log("ScratchLog: " + JSON.stringify(log));	
		this.logBuffer.push(log);
		
	}

	public static info(message:string, extraData?:any) {
		Log._LOG.log(LogLevel.INFO, message, extraData);
	}	

	public static warning(message:string, extraData?:any) {
		Log._LOG.log(LogLevel.WARNING, message, extraData);
	}	
	
	public static error(message:string, extraData?:any) {
		Log._LOG.log(LogLevel.ERROR, message, extraData);
	}
	
	public static track(message:string, extraData?:any) {
		Log._LOG.log(LogLevel.TRACK, message, extraData);
	}
	
	public static debug(message:string, extraData?:any) {
		Log._LOG.log(LogLevel.DEBUG, message, extraData);
	}


	// Generate a JSON-compatible object representing the contents of the log in a human- and machine-readable way.
	public report(severityLimit:string = LogLevel.DEBUG):any {
		
		return this.logBuffer;
	}
}

