import jwt from "jsonwebtoken";

export interface User {
	isModified: any
	_id: string
	username: string
	phoneNumber: string
	avatar?: string
	password: string
	accessToken:string
}

export  interface Chat {
	members: User[]
	messages: Message[]
	accessToken:string

}

export interface Message {
	sender: User
	content: {
		text?: string
		media?: string
	}
	accessToken:string
	timestamp: number

}

export interface JwtPayload extends jwt.JwtPayload {
	_id: string
	username: string

}
