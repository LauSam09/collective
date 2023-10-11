import { useContext } from "react"

import { AuthenticationContext } from "../contexts/AuthenticationContext"

export const useAuthentication = () => useContext(AuthenticationContext)
