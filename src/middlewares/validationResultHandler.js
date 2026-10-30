import { validationResult } from "express-validator";

export const checkValidationsResult = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const customErrorMsg = errors.formatWith((err) => {
            return `${err.path}: ${err.msg}`
        })
        return res.status(400).json(customErrorMsg.array())
    }
    next()
}