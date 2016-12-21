/**
 * Integrate this beta plugin with core Fieldmanager scripts.
 *
 * Typically, these changes would most likely appear in the Fieldmanager core
 * scripts for Autocomplete, Datepicker, etc.
 */
(function( $ ) {
	// Enable Autocomplete when focusing on an Autocomplete input.
	$( document ).on( 'focus',
		'input[class*="fm-autocomplete"]:not(.fm-autocomplete-enabled)',
		fm.autocomplete.enable_autocomplete
	);

	// Enable Datepickers.
	$( document ).on( 'fm_beta_customize_control_section_expanded', fm.datepicker.add_datepicker );
})( jQuery );
