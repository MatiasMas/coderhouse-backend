import { optionsMySQL } from './configMySQL.js'
import {optionsSQLite3} from './configSQLite3.js'
import _knex from 'knex'

export const knexMySQL = _knex(optionsMySQL)
export const knexSQLite = _knex(optionsSQLite3)