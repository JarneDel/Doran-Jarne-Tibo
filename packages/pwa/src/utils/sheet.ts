//@ts-nocheck

import { promises as fs } from 'fs'
import path, * as Path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'src/utils/token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/utils/oauthsecret.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

async function generateTranslations(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  for (const key in SUPPORTED_LOCALES) {
    const locale = SUPPORTED_LOCALES[key]
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '16GYXaVcVnrA_K-XOY9DYLto1OKcnRWxJVT9WsYIdWz8',
      range: key,
    })
    const rows = res.data.values
    if (!rows || rows.length == 0) {
      console.log('No data found')
      return
    }

    const translations = { [key]: {} }
    for (const row of rows) {
      translations[key][row[0]] = row[2]
    }

    await fs.writeFile(
      Path.join(process.cwd(), `/src/locales/${key}.json`),
      JSON.stringify(translations),
    )
  }
}

authorize()
  .then(generateTranslations)
  .catch(console.error)
  .then(() => {
    console.log('Done')
    process.exit()
  })
