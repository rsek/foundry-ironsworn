declare interface FilePickerOptions extends ApplicationOptions {
	/**
	 * A type of file to target, in "audio", "image", "video", "imagevideo", "folder", "font", "graphics", "text", or "any"
	 * @default "any"
	 */
	type?:
		| 'audio'
		| 'image'
		| 'video'
		| 'imagevideo'
		| 'folder'
		| 'font'
		| 'graphics'
		| 'text'
		| 'any'
	/**
	 *  The current file path being modified, if any
	 */
	current?: FilePath
	/**
	 * A current file source in "data", "public", or "s3"
	 * @default "data"
	 */
	activeSource?: 'data' | 'public' | 's3'
	/**
	 * A callback function to trigger once a file has been selected
	 */
	callback?: (path: FilePath, filePicker: FilePicker) => any
	/**
	 * A flag which permits explicitly disallowing upload, true by default
	 * @default true
	 */
	allowUpload?: boolean
	/**
	 * An HTML form field that the result of this selection is applied to
	 */
	field?: HTMLElement
	/**
	 * An HTML button element which triggers the display of this picker
	 */
	button?: HTMLButtonElement
	/**
	 * The picker display mode in FilePicker.DISPLAY_MODES
	 */
	displayMode?: 'list' | 'thumbs' | 'tiles' | 'images'
	/**
	 * Display the tile size configuration.
	 * @default false
	 */
	tileSize?: boolean
}

export {}
