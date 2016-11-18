<?php
/**
 * Class file for Fieldmanager_Beta_Customize_Control.
 *
 * @package Fieldmanager_Customize
 */

if ( class_exists( 'WP_Customize_Control' ) ) :
	/**
	 * Render a Fieldmanager field as a Customizer control.
	 */
	class Fieldmanager_Beta_Customize_Control extends WP_Customize_Control {
		/**
		 * The Fieldmanager context controlling this field.
		 *
		 * @var Fieldmanager_Context
		 */
		protected $context;

		/**
		 * The control 'type', used in scripts to identify FM controls.
		 *
		 * @var string
		 */
		public $type = 'fieldmanager';

		/**
		 * Constructor.
		 *
		 * @throws FM_Developer_Exception When no context is included.
		 *
		 * @param WP_Customize_Manager $manager WP_Customize_Manager instance.
		 * @param string               $id      Control ID.
		 * @param array                $args    Control arguments, including $context.
		 */
		public function __construct( $manager, $id, $args = array() ) {
			parent::__construct( $manager, $id, $args );

			if ( ! ( $this->context instanceof Fieldmanager_Beta_Context_Customize ) && FM_DEBUG ) {
				throw new FM_Developer_Exception(
					__( 'Fieldmanager_Beta_Customize_Control requires a Fieldmanager_Beta_Context_Customize', 'fieldmanager-beta-customize' )
				);
			}
		}

		/**
		 * Enqueue control-related scripts and styles.
		 */
		public function enqueue() {
			Fieldmanager_Util_Assets::instance()->add_style( array(
				'deps'       => array( 'fieldmanager_style' ),
				'handle'     => 'fm_beta_customize',
				'path'       => 'css/fieldmanager-customize.css',
				'plugin_dir' => FM_BETA_CUSTOMIZE_URL,
				'ver'        => FM_BETA_CUSTOMIZE_VERSION,
			) );

			wp_register_script(
				'fm-serializejson',
				FM_BETA_CUSTOMIZE_URL . 'js/jquery-serializejson/jquery.serializejson.min.js',
				array(),
				'2.0.0',
				true
			);

			fm_add_script(
				'fm_beta_customize_overrides',
				'js/beta-overrides.js',
				array( 'jquery', 'underscore', 'editor', 'quicktags', 'fieldmanager_script', 'customize-controls', 'fm-serializejson' ),
				FM_BETA_CUSTOMIZE_VERSION,
				true,
				'',
				array(),
				FM_BETA_CUSTOMIZE_URL
			);

			fm_add_script(
				'fm-customize',
				'js/fieldmanager-customize.js',
				array( 'fm_beta_customize_overrides' ),
				FM_BETA_CUSTOMIZE_VERSION,
				true,
				'',
				array(),
				FM_BETA_CUSTOMIZE_URL
			);
		}

		/**
		 * Render the control's content.
		 *
		 * @see Fieldmanager_Context::render_field().
		 * @see WP_Customize_Control::render_content().
		 */
		protected function render_content() {
			?>

			<?php if ( ! empty( $this->label ) ) : ?>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
			<?php endif; ?>

			<?php if ( ! empty( $this->description ) ) : ?>
				<span class="description customize-control-description"><?php echo esc_html( $this->description ); ?></span>
			<?php endif; ?>

			<?php
			$this->context->render_field( array( 'data' => $this->value() ) );
		}
	}
endif;
