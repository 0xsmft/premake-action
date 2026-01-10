const core      = require('@actions/core');
const toolcache = require('@actions/tool-cache');
const fs        = require('fs');
const path      = require('path');

function GetPremakeVersion() 
{
	const arg = process.argv.find(a => a.startsWith('--premake-version='));
	return arg ? arg.split('=')[1] : '5.0.0-beta7';
}

const PREMAKE_VERSION = GetPremakeVersion();
const BASE_URL = `https://github.com/premake/premake-core/releases/download/v${PREMAKE_VERSION}`;

async function DownloadPremake() 
{
	let archiveName;
	let extractFunction;
	
	switch( process.platform )
	{
		case 'win32':
		{
			archiveName = `premake-${PREMAKE_VERSION}-windows.zip`;
			extractFunction = toolcache.extractZip;
		} break;

		case 'darwin':
		{
			archiveName = `premake-${PREMAKE_VERSION}-macosx.tar.gz`;
			extractFunction = toolcache.extractTar;
		} break;

		default:
		{
			archiveName = `premake-${PREMAKE_VERSION}-linux.tar.gz`;
			extractFunction = toolcache.extractTar;
		} break;
	}

	const url = `${BASE_URL}/${archiveName}`;
	core.info(`Downloading Premake ${PREMAKE_VERSION} from ${url}`);

	const archivePath = await toolcache.downloadTool(url);
	const extractedPath = await extractFunction( archivePath );

	return extractedPath;
}

function MakeExecutableIfNeeded( extractedPath ) 
{
	if( process.platform === 'win32' ) return;

	const premakeBin = path.join( extractedPath, 'premake5' );

	core.info( `Making Premake executable: ${premakeBin}` );
	fs.chmodSync( premakeBin, 0o755 );
}

async function main()
{
	try 
	{
		const premakeDir = await DownloadPremake();
		MakeExecutableIfNeeded( premakeDir );

		core.addPath( premakeDir );
		core.info( `Premake added to PATH: ${premakeDir}` );
	}
	catch( error ) 
	{
		core.setFailed( `Premake setup failed: ${error.message || error}` );
	}
}

main();
