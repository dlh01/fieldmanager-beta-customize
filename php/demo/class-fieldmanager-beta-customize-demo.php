<?php
/**
 * Class file for Fieldmanager_Beta_Customize_Demo.
 *
 * @package Fieldmanager_Beta_Customize
 */

/**
 * Customize context demos.
 */
class Fieldmanager_Beta_Customize_Demo {
	/**
	 * Class instance.
	 *
	 * @var Fieldmanager_Beta_Customize_Demo
	 */
	private static $instance;

	/**
	 * Get the class instance.
	 *
	 * @return Fieldmanager_Beta_Customize_Demo
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new Fieldmanager_Beta_Customize_Demo;
			self::$instance->setup();
		}
		return self::$instance;
	}

	/**
	 * Set up.
	 */
	public function setup() {
		add_action( 'fm_beta_customize', array( $this, 'customizer_init' ), 1000 );
	}

	/**
	 * Initialize demos.
	 */
	public function customizer_init() {
		$fm = new Fieldmanager_Textfield( array( 'name' => 'basic_text' ) );
		fm_beta_customize_add_to_customizer( array(
			'section_args' => array(
				'priority' => 10,
				'title' => 'Fieldmanager Text Field',
			),
		), $fm );

		$fm = new Fieldmanager_Group( array(
			'name'           => 'option_fields',
			'children' => array(
				'text'         => new Fieldmanager_Textfield( 'Text Field' ),
				'autocomplete' => new Fieldmanager_Autocomplete( 'Autocomplete', array( 'datasource' => new Fieldmanager_Datasource_Post() ) ),
				'local_data'   => new Fieldmanager_Autocomplete( 'Autocomplete without ajax', array(
					'datasource' => new Fieldmanager_Datasource( array(
						'options' => array( 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' )
					 ) ),
				) ),
				'textarea'     => new Fieldmanager_TextArea( 'TextArea' ),
				'media'        => new Fieldmanager_Media( 'Media File' ),
				'checkbox'     => new Fieldmanager_Checkbox( 'Checkbox' ),
				'radios'       => new Fieldmanager_Radios( 'Radio Buttons', array( 'options' => array( 'One', 'Two', 'Three' ) ) ),
				'select'       => new Fieldmanager_Select( 'Select Dropdown', array( 'options' => array( 'One', 'Two', 'Three' ) ) ),
				'richtextarea' => new Fieldmanager_RichTextArea( 'Rich Text Area' ),
			)
		) );
		fm_beta_customize_add_to_customizer( array(
			'section_args' => array(
				'capability'     => 'edit_posts',
				'description'    => 'A Fieldmanager demo section',
				'priority'       => 15,
				'title'          => 'Fieldmanager Group',
			),
			'setting_args' => array(
				'type' => 'theme_mod',
				'transport' => 'postMessage',
			),
		), $fm );

		add_action( 'wp_footer', array( $this, 'wp_footer' ), 100 );

		$fm = new Fieldmanager_Group( array(
			'name' => 'contact_methods',
			'children' => array(
				'twitter_handle'   => new Fieldmanager_TextField( __( 'Twitter Handle', 'fieldmanager-beta-customize' ) ),
				'facebook_url'     => new Fieldmanager_Link( __( 'Facebook URL', 'fieldmanager-beta-customize' ) ),
				'instagram_handle' => new Fieldmanager_TextField( __( 'Instagram Handle', 'fieldmanager-beta-customize' ) ),
				'youtube_url'      => new Fieldmanager_Link( __( 'YouTube URL', 'fieldmanager-beta-customize' ) ),
			),
		) );
		fm_beta_customize_add_to_customizer( 'Contact Methods', $fm );

		$fm = new Fieldmanager_Group( array(
			'name'           => 'repeatable_text',
			'description'    => 'Psst... There is also a hidden field in this meta box with a set value.',
			'children'       => array(
				'password_field'        => new Fieldmanager_Password( 'Password Field' ),
				'hidden_field'          => new Fieldmanager_Hidden( 'Hidden Field', array( 'default_value' => 'Fieldmanager was here' ) ),
				'link_field'            => new Fieldmanager_Link( 'Link Field', array( 'description' => 'This is a text field that sanitizes the value as a URL' ) ),
				'date_field'            => new Fieldmanager_Datepicker( 'Datepicker Field' ),
				'color_field'           => new Fieldmanager_Colorpicker( 'Colorpicker Field' ),
				'date_customized_field' => new Fieldmanager_Datepicker( array(
					'label'       => 'Datepicker Field with Options',
					'date_format' => 'Y-m-d',
					'use_time'    => true,
					'js_opts'     => array(
						'dateFormat'  => 'yy-mm-dd',
						'changeMonth' => true,
						'changeYear'  => true,
						'minDate'     => '2010-01-01',
						'maxDate'     => '2015-12-31'
					)
				) ),
			)
		) );
		fm_beta_customize_add_to_customizer( array(
			'section_args' => array(
				'title' => 'Fieldmanager Miscellaneous Fields',
				'panel' => 'fm_demos',
			),
			'control_args' => array(
				'section' => 'title_tagline',
				'priority' => 200,
			),
		), $fm );

		$fm = new Fieldmanager_TextField( 'Field Requiring Numeric Values', array(
			'name' => 'validated_text',
			'description' => 'Try typing "Cowbell" and saving your changes.',
			'validate' => array( 'is_numeric' ),
			'sanitize' => 'intval',
		) );
		fm_beta_customize_add_to_customizer( 'Fieldmanager Validated Fields', $fm );
	}

	/**
	 * Display the value of some demo fields in the Customizer preview.
	 */
	public function wp_footer() {
		if ( ! is_customize_preview() ) {
			return;
		}

		$option_fields = get_theme_mod( 'option_fields' );
		?>
			<div id="fm-demo-customizer" style="
				background-color: #000;
				color: #fff;
				padding: 1em;
				position: fixed;
				top: 0;
				width: 100%;
				z-index: 10000000;
			">
				<p>Greetings from the Fieldmanager Customizer demos.</p>
				<p>The values you see below are controlled by "Fieldmanager Text Field" and "Fieldmanager Group" sections in the Customizer. Try changing them to see the results.</p>
				<ul>
					<li>Text Field (using "refresh" transport): <?php echo esc_html( get_option( 'basic_text' ) ); ?></li>
					<li>Group (using "postMessage" transport):
						<ul>
							<li>Text Field:                <span id="fm-postmessage-text"><?php echo ( isset( $option_fields['text'] ) ) ? esc_html( $option_fields['text'] ) : '' ?></span></li>
							<li>Autocomplete:              <span id="fm-postmessage-autocomplete"><?php echo ( isset( $option_fields['autocomplete'] ) ) ? esc_html( $option_fields['autocomplete'] ) : '' ?></span></li>
							<li>Autocomplete without ajax: <span id="fm-postmessage-local_data"><?php echo ( isset( $option_fields['local_data'] ) ) ? esc_html( $option_fields['local_data'] ) : '' ?></span></li>
							<li>TextArea:                  <span id="fm-postmessage-textarea"><?php echo ( isset( $option_fields['textarea'] ) ) ? esc_html( $option_fields['textarea'] ) : '' ?></span></li>
							<li>Media File:                <span id="fm-postmessage-media"><?php echo ( isset( $option_fields['media'] ) ) ? esc_html( $option_fields['media'] ) : '' ?></span></li>
							<li>Checkbox:                  <span id="fm-postmessage-checkbox"><?php echo ( isset( $option_fields['checkbox'] ) ) ? esc_html( $option_fields['checkbox'] ) : '' ?></span></li>
							<li>Radio Buttons:             <span id="fm-postmessage-radios"><?php echo ( isset( $option_fields['radios'] ) ) ? esc_html( $option_fields['radios'] ) : '' ?></span></li>
							<li>Select Dropdown:           <span id="fm-postmessage-select"><?php echo ( isset( $option_fields['select'] ) ) ? esc_html( $option_fields['select'] ) : '' ?></span></li>
							<li>Rich Text Area:            <span id="fm-postmessage-richtextarea"><?php echo ( isset( $option_fields['richtextarea'] ) ) ? esc_html( $option_fields['richtextarea'] ) : '' ?></span></li>
						</ul>
					</li>
				</ul>
			</div>
			<script>
				(function() {
					var intervalID = setInterval(function() {
						if ( wp.customize ) {
							preview();
						}
					}, 500 );

					function preview() {
						wp.customize( 'option_fields', function ( value ) {
							value.bind( function ( to ) {
								for ( var key in to ) {
									if ( to.hasOwnProperty( key ) ) {
										document
											.getElementById( 'fm-postmessage-' + key )
											.textContent = to[ key ];
									}
								}

								// Handle checkbox.
								if ( ! to.hasOwnProperty( 'checkbox' ) ) {
									document
										.getElementById( 'fm-postmessage-checkbox' )
										.textContent = '';
								}
							});
						});

						clearInterval( intervalID );
					}
				})();
			</script>
		<?php
	}
}
