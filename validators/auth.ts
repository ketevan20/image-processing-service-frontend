import * as yup from "yup"

export const schema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().min(6).max(20).required("password is required"),
})