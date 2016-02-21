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
	

export class LogLevel {
	
	// Use this for problems that should be in our control
	static ERROR:string = "err";

	// Use this for unexpected conditions and problems outside our control (network, user data, etc.)
	static WARNING:string = "wrn";

	// These events will be communicated to JS so they can be handled by web UI, sent to GA, etc.
	static TRACK:string = "trk";

	// Use this to report status information
	static INFO:string = "inf";

	// Use this to report information useful for debugging
	static DEBUG:string = "dbg";

	static LEVEL:any[] = [
		LogLevel.ERROR, LogLevel.WARNING, LogLevel.TRACK, LogLevel.INFO, LogLevel.DEBUG
	];
}
//}
