import jwt from "jsonwebtoken";

export interface User {
	isModified: any
	_id: string
	username: string
	phoneNumber: string
	avatar?: string
	password: string
	[key: string]: string|Number|Boolean|Date|undefined;
}

export  interface Chat {
	members: User[]
	messages: Message[]
}

export interface Message {
	sender: User
	content: {
		text?: string
		media?: string
	}
	timestamp: number
}

export interface JwtPayload extends jwt.JwtPayload {
	_id: string
	username: string
}
