import { useSession } from "next-auth/react"
import Router from "next/router"
import { useEffect } from "react"

const Users = () => {
    const {status, data: session} = useSession()
  
    useEffect(() => {
      if(status === "unauthenticated") {
        Router.replace('/Login')
      }
    },[status])

    return <div>Users</div>
}

export default Users;