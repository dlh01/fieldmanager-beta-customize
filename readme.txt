=== Fieldmanager Beta: Customize ===
Contributors: dlh, jamesburke, alleyinteractive
Requires at least: 4.4
Tested up to: 4.7
Stable tag: 0.3.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A Fieldmanager Beta plugin for the Customize Context.

== Description ==

This is a proposed Customize context for Fieldmanager. You can install the plugin alongside a stable Fieldmanager release to help test and refine the context.

The official Pull Request for this context, plus tests, is [on GitHub](https://github.com/alleyinteractive/wordpress-fieldmanager/pull/399).

== Installation ==

1. Install and activate [Fieldmanager](https://github.com/alleyinteractive/wordpress-fieldmanager).
2. Install and activate this plugin.
3. Use the `fm_beta_customize` context action to instantiate your fields. For example:

		add_action( 'fm_beta_customize', function () {
			$fm = new Fieldmanager_TextField( 'My Field', [ 'name' => 'foo' ] );
			fm_beta_customize_add_to_customizer( 'My Section', $fm );
		} );

For more code examples, browse `php/demos/class-fieldmanager-beta-customize-demo.php`. To see the demos in action in the Customizer, place `add_action( 'fm_beta_customize', 'fm_beta_customize_demo' )` in your plugin or theme.

== Screenshots ==

1. Fieldmanager mingling with other sections in the Customizer.
2. Fieldmanager fields in the Customizer.
3. Detail from the demos bundled with this plugin.

== Changelog ==

= Unreleased =
* Added: Demo a field with selective-refresh support.

= 0.3.1 =
* Fixed: Track the changes to instances of repeatable RichTextAreas and Colorpickers added after loading the Customizer.

= 0.3.0 =
* Changed: `Fieldmanager_RichTextArea` is now supported natively; using `Fieldmanager_Beta_Customize_RichTextArea` is no longer required.
* Changed: Move remaining scripts that overrode Fieldmanager core assets into separate files.
* Fixed: Fix invisible TinyMCE popups.
* Deprecated: `Fieldmanager_Beta_Customize_RichTextArea`, per above.

= 0.2.1 =
* Fix JavaScript errors.

= 0.2.0 =
* Move CSS, and autocomplete and datepicker scripts, into separate files, rather than overriding those assets in Fieldmanager core.

= 0.1.1 =
* Rename the Customize context action to 'fm_beta_customize' for improved future compatibility with Fieldmanager.

= 0.1.0 =
* Initial release.
