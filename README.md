## Install database
Downloading and Running DynamoDB

> http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

To start DynamoDB on your computer, open a command prompt window, navigate to the directory where you extracted DynamoDBLocal.jar, and enter the following command:

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
In your project directory, run:

```bash
npm run db all init
```
to create table and add sample data

If you have error about "credentials".
>http://docs.aws.amazon.com/AWSSdkDocsNET/V2/DeveloperGuide/net-dg-config-creds.html

## Install npm packages and start your server

Install the npm packages described in the `package.json` and verify that it works:

```bash
npm install
```

Install the tsd packages described in the `tsd.json`

```bash
tsd install
```

Compile source from typescript to es6
```bash
npm run grunt
```
Start your server

```bash
npm start
```

### npm scripts

We've captured many of the most useful commands in npm scripts defined in the `package.json`:

* `npm start` - start server
* `npm run grunt` - compile source from typescript into es6
* `npm run db [table] [command]` - script for database ( command: init, reset, delete, create, sample )

>table: thread, message, user ( default: all )

>command: init, reset, delete, create, sample ( default: init )

>init = create -> sample

>reset = delete -> create -> sample

