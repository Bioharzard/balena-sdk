import type { Dictionary } from '../../typings/utils';

/* types for the /device-types/v1 endppoints */

export interface DeviceType {
	slug: string;
	name: string;
	aliases: string[];

	arch: string;
	state?: string;
	community?: boolean;
	private?: boolean;

	isDependent?: boolean;
	imageDownloadAlerts?: DeviceTypeDownloadAlert[];
	/** @deprecated Use the balena.models.deviceType.getInstructions() */
	instructions?: string[] | DeviceTypeInstructions;
	gettingStartedLink?: string | DeviceTypeGettingStartedLink;
	stateInstructions?: { [key: string]: string[] };
	options?: DeviceTypeOptions[];
	initialization?: {
		options?: DeviceInitializationOptions[];
		operations: Array<{
			command: string;
		}>;
	};
	/** @deprecated Use the DeviceType.contract.data.led */
	supportsBlink?: boolean;
	yocto: {
		fstype?: string;
		deployArtifact: string;
	};
	/** Holds the latest balenaOS version */
	buildId?: string;
	/** @deprecated Use the logo field from the models.deviceType.get() method. */
	logoUrl?: string;
}

export interface DeviceTypeDownloadAlert {
	type: string;
	message: string;
}

export interface DeviceTypeInstructions {
	linux: string[];
	osx: string[];
	windows: string[];
}

export interface DeviceTypeGettingStartedLink {
	linux: string;
	osx: string;
	windows: string;
	[key: string]: string;
}

export interface DeviceTypeOptions {
	options: DeviceTypeOptionsGroup[];
	collapsed: boolean;
	isCollapsible: boolean;
	isGroup: boolean;
	message: string;
	name: string;
}

export interface DeviceInitializationOptions {
	message: string;
	type: string;
	name: string;
}

export interface DeviceTypeOptionsGroup {
	default: number | string;
	message: string;
	name: string;
	type: string;
	min?: number;
	max?: number;
	hidden?: boolean;
	when?: Dictionary<number | string | boolean>;
	choices?: string[] | number[];
	choicesLabels?: Dictionary<string>;
}
