import { Credentials, OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import * as readline from 'readline';
import { google, sheets_v4 } from 'googleapis';
import { IPeople, IPeopleRequest } from './types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

export const spreadsheetId = '1E4VYzkod6F2h6PGOmeOC0FrRtu1CKQm1ZcfzkKOD-b0';

export class GoogleService {
  private oAuth2Client?: OAuth2Client;

  public sheetClient?: sheets_v4.Sheets;

  async authorize() {
    const content = (await fs.readFileSync('credentials.json')).toString();

    if (!content) return;

    const credentials: {
      installed: {
        client_id: string;
        client_secret: string;
        redirect_uris: string[];
      };
    } = JSON.parse(content);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    this.oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    this.sheetClient = google.sheets({
      version: 'v4',
      auth: this.oAuth2Client,
    });

    try {
      const token: unknown = await fs.readFileSync(TOKEN_PATH);

      if (token) {
        this.oAuth2Client.setCredentials(JSON.parse(token as string));
      } else {
        this.getAccessToken();
      }
    } catch {
      this.getAccessToken();
    }
  }

  getAccessToken() {
    if (!this.oAuth2Client) return;
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', async (code) => {
      if (!this.oAuth2Client) return;

      rl.close();
      let tokens: Credentials;
      try {
        const tokenResponse = await this.oAuth2Client.getToken(code);
        tokens = tokenResponse.tokens;
      } catch (error) {
        return;
      }
      this.oAuth2Client.setCredentials(tokens);

      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      } catch (error) {
        console.log(error);
      }
    });
  }

  async getPeople(): Promise<IPeople[]> {
    return new Promise((resolve) => {
      this.sheetClient?.spreadsheets.values
        .get({
          spreadsheetId,
          range: 'people!A2:G',
        })
        .then((res) => {
          resolve(
            res.data.values?.map((r: string[]) => ({
              name: r[1],
              discordId: r[2],
              lolName: r[3],
              position: r[4],
              subPosition: r[5],
              tier: Number(r[6]),
            })) ?? []
          );
        });
    });
  }

  async updatePeople(req: IPeopleRequest): Promise<number> {
    const { name, type } = req;
    return new Promise((resolve) => {
      this.sheetClient?.spreadsheets.values
        .get({
          spreadsheetId,
          range: 'people!A2:G',
        })
        .then((res) => {
          const { values } = res.data;

          const index = values?.findIndex((f) => f[1] === name);

          if (index !== undefined && index >= 0 && values) {
            let newTier = Number(values[index][6]);

            if (type === 'down') {
              newTier -= 0.4;
            } else {
              newTier += 0.4;
            }

            values[index][6] = String(newTier);

            this.sheetClient?.spreadsheets.values
              .update({
                spreadsheetId,
                range: 'people!A2:G',
                valueInputOption: 'RAW',
                requestBody: {
                  values,
                },
              })
              .then(() => resolve(newTier));
          }
        });
    });
  }

  async logPeople(req: IPeopleRequest): Promise<boolean> {
    const { name, type, reason } = req;

    return new Promise((resolve) => {
      this.sheetClient?.spreadsheets.values
        .get({
          spreadsheetId,
          range: 'log!A1:Z',
          majorDimension: 'ROWS',
        })
        .then((res) => {
          const { values } = res.data;
          if (!values) {
            resolve(false);
            return;
          }
          const index = values.findIndex((f) => f[0] === name);

          if (index >= 0) {
            values[index].push(
              `[${new Date(+new Date() + 3240 * 10000)
                .toISOString()
                .replace('T', ' ')
                .replace(/\..*/, '')}] <${type}>\n${reason}`
            );
          }

          this.sheetClient?.spreadsheets.values
            .update({
              spreadsheetId,
              range: 'log!A1:Z',
              valueInputOption: 'RAW',
              requestBody: {
                values,
              },
            })
            .then(() => resolve(true));
        });
    });
  }
}
