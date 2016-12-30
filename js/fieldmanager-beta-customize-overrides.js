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

			$( '.fm-colorpicker-popup' ).each(function () {
				var $this = $( this );

				if ( $this.wpColorPicker( 'instance' ) && ! $this.data( 'fm-beta-customize' ) ) {
					$this.data( 'fm-beta-customize', true );

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
				}
			});
		}

		// Initialize RichTextAreas and respond to changes.
		if ( fm.richtextarea ) {
			fm.richtextarea.add_rte_to_visible_textareas();

			tinymce.editors.forEach(function ( ed ) {
				var $fm_richtext = $( document.getElementById( ed.id ) );

				if ( $fm_richtext.hasClass( 'fm-richtext' ) && ! $fm_richtext.data( 'fm-beta-customize' ) ) {
					$fm_richtext.data( 'fm-beta-customize', true );

					// SetContent handles adding images from the media modal and pasting.
					ed.on( 'keyup AddUndo SetContent', function () {
						ed.save();
						fm.beta.customize.setControlsContainingElement( document.getElementById( ed.id ) );
					});
				}
			});
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
})( jQuery );
