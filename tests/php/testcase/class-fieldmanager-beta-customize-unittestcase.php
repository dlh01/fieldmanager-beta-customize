<?php
class Fieldmanager_Beta_Customize_UnitTestCase extends WP_UnitTestCase {
	protected $manager;

	public function setUp() {
		parent::setUp();
		$this->manager = new WP_Customize_Manager();
	}

	public function register() {
		do_action( 'customize_register', $this->manager );
	}

	/**
	 * Filters 'map_meta_cap' to map the 'customize' capability to 'exist'.
	 *
	 * @param  array  $caps Required primitive capabilities.
	 * @param  string $cap  Meta capability.
	 * @return array        Updated required capabilities.
	 */
	public function map_customize_meta_cap_to_exist( $caps, $cap ) {
		if ( 'customize' === $cap ) {
			$caps = array( 'exist' );
		}

		return $caps;
	}

	/**
	 * Add hooks to grant all users the capabilities to use the Customizer.
	 *
	 * @return bool Whether the hooks were successfully added.
	 */
	protected function let_all_users_customize() {
		return (
			add_filter( 'map_meta_cap', array( $this, 'map_customize_meta_cap_to_exist' ), 10, 2 )
		);
	}
}
