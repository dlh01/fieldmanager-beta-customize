<?php
/**
 * Class file for Fieldmanager_Beta_Customize_RichTextArea.
 *
 * @package Fieldmanager_Field
 */

/**
 * Customizer RichTextArea.
 */
class Fieldmanager_Beta_Customize_RichTextArea extends Fieldmanager_RichTextArea {
	/**
	 * Whether this class is hooked into the Customizer to print editor scripts.
	 *
	 * @var bool
	 */
	public static $has_registered_customize_scripts = false;

	/**
	 * Render the form element.
	 *
	 * @param  mixed $value Field value.
	 * @return string       HTML.
	 */
	public function form_element( $value = '' ) {
		if ( ! isset( $this->editor_settings['teeny'] ) ) {
			$this->editor_settings['teeny'] = true;
		}

		return parent::form_element( $value );
	}

	/**
	 * Add necessary filters before generating the editor.
	 */
	protected function add_editor_filters() {
		parent::add_editor_filters();

		if ( ! self::$has_registered_customize_scripts ) {
			// This action must fire after settings are exported in WP_Customize_Manager::customize_pane_settings().
			add_action( 'customize_controls_print_footer_scripts', array( $this, 'customize_controls_print_footer_scripts' ), 1001 );
			self::$has_registered_customize_scripts = true;
		}
	}

	/**
	 * Print Customizer control scripts in the footer.
	 */
	public function customize_controls_print_footer_scripts() {
		if ( class_exists( '_WP_Editors' ) ) {
			if ( false === has_action( 'customize_controls_print_footer_scripts', array( '_WP_Editors', 'editor_js' ) ) ) {
				// Print the necessary JS for an RTE, unless we can't or suspect it's already there.
				_WP_Editors::editor_js();
				_WP_Editors::enqueue_scripts();
			}
		}
	}
}
