namespace Express{
    interface User {
      accessToken?:string,
      _id?:string,
    }
    interface Request{
        user?: User,
        accessToken:string,
    }
}
