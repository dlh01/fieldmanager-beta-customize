/**
 * Integrate this beta plugin with core Fieldmanager scripts.
 */
(function( $ ) {
	// Enable Autocomplete when focusing on an Autocomplete input.
	if ( fm.autocomplete ) {
		$( document ).on( 'focus',
			'input[class*="fm-autocomplete"]:not(.fm-autocomplete-enabled)',
			fm.autocomplete.enable_autocomplete
		);
	}

	$( document ).on( 'fm_beta_customize_control_section_expanded', function () {
		// Initialize Datepickers.
		if ( fm.datepicker ) {
			fm.datepicker.add_datepicker();
		}

		// Initialize display-ifs.
		if ( fm.init_display_if ) {
			$( '.display-if' ).each( fm.init_display_if );
		}

		// Initialize Colorpickers and respond to changes.
		if ( fm.colorpicker ) {
			fm.colorpicker.init();
		}

		// Initialize RichTextAreas.
		if ( fm.richtextarea ) {
			fm.richtextarea.add_rte_to_visible_textareas();
		}

		// Initialize sortables via existing event.
		$( document ).trigger( 'fm_activate_tab' );

		// Initialize label macros with a copy of init_label_macros(), which is
		// suboptimal but more optimal than copying all of fieldmanager.js.
		(function() {
			$( '.fm-label-with-macro' ).each( function( label ) {
				$( this ).data( 'label-original', $( this ).html() );
				var src = $( this ).parents( '.fm-group' ).first().find( $( this ).data( 'label-token' ) );
				if ( src.length > 0 ) {
					var $src = $( src[0] );
					if ( typeof $src.val === 'function' ) {
						var $label = $( this );
						var title_macro = function() {
							var token = '';
							if ( $src.prop( 'tagName' ) == 'SELECT' ) {
								var $option = $src.find( 'option:selected' );
								if ( $option.val() ) {
									token = $option.text();
								}
							} else {
								token = $src.val();
							}
							if ( token.length > 0 ) {
								$label.html( $label.data( 'label-format' ).replace( '%s', token ) );
							} else {
								$label.html( $label.data( 'label-original' ) );
							}
						};
						$src.on( 'change keyup', title_macro );
						title_macro();
					}
				}
			} );
		})();
	});

	// Respond to RichTextArea changes.
	$( document ).on( 'tinymce-editor-init', function ( event, editor ) {
		var editorElement = document.getElementById( editor.id );

		if ( editorElement && editorElement.classList.contains( 'fm-richtext' ) ) {
			/*
			 * Debouncing or throttling updates to fields creates an FM-specific
			 * deviation to how users experience the Customizer adds maintenance
			 * requirements for the plugin.
			 *
			 * Without debouncing or throttling, changes to settings using the
			 * `postMessage` transport are faster. The Customizer's refresh
			 * framework also debounces natively.
			 */
			editor.on( 'input change keyup', function () {
				editor.save();
				fm.beta.customize.setControlsContainingElement( editorElement );
			});
		}
	});

	// Respond to Colorpicker changes.
	$( document ).on( 'wpcolorpickercreate', '.fm-colorpicker-popup', function () {
		var $this = $( this );

		$this.wpColorPicker( 'instance' ).option( 'change', function ( event, ui ) {
			// Make sure the input's value attribute also changes.
			$this.attr( 'value', ui.color.toString() );
			fm.beta.customize.setControlsContainingElement( this );
		});

		$this.wpColorPicker( 'instance' ).option( 'clear', function () {
			// Make sure the input's value attribute also changes.
			$this.attr( 'value', '' );
			fm.beta.customize.setControlsContainingElement( this );
		});
	});
})( jQuery );
