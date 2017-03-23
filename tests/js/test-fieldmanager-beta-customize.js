/* global wp */

(function( QUnit, $ ) {
	function randStr() {
		return Math.random().toString( 36 ).replace( '0.', '' );
	}

	QUnit.begin(function( details ) {
		// Don't hide the fixture div by default: FM relies on visibility.
		$( '#qunit-fixture' ).css( 'position', 'static' );
	});

	QUnit.done(function( details ) {
		// Hide the fixtures div again: We don't need it to review the results.
		$( '#qunit-fixture' ).css( 'position', 'absolute' );
	});

	QUnit.module( 'fm.beta.customize API', function ( hooks ) {
		QUnit.test( 'setControl sets Fieldmanager control setting', function ( assert ) {
			var initialValue = randStr();

			var setting = new wp.customize.Setting( randStr(), initialValue, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			var control = new wp.customize.Control( randStr(), {
				setting: setting,
				params: {
					settings: { 'default': setting.id },
					type: 'fieldmanager-beta',
				},
			});

			assert.equal( fm.beta.customize.setControl( control ), setting, 'Should return setting' );
			assert.notEqual( setting.get(), initialValue, 'Setting value should change' );
		});

		QUnit.test( 'setControl ignores non-Fieldmanager controls', function ( assert ) {
			var value     = randStr();
			var settingId = randStr();

			var setting = new wp.customize.Setting( settingId, value, {
				transport: 'noop',
				previewer: wp.customize.previewer
			});

			var control = new wp.customize.Control( randStr(), {
				setting: setting,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'type', 'text' )
							.attr( 'name', settingId )
					),
					settings: { 'default': setting.id },
					type: 'text',
				},
			});

			assert.notOk( fm.beta.customize.setControl( control ), 'Should not return setting' );
			assert.equal( setting.get(), value, 'Setting value should not change' );
		});

		QUnit.test( 'setControl serializes only values in targetSelector', function ( assert ) {
			var settingId         = randStr();
			var settingValue      = randStr();
			var fmElementValue    = randStr();
			var notFmElementValue = randStr();

			var markup = $( '<li>' ).append(
				$( '<input />' )
					.addClass( 'fm-element' )
					.attr( 'name', settingId )
					.attr( 'value', fmElementValue ),
				$( '<input />' )
					.addClass( 'not-fm-element' )
					.attr( 'name', 'bar' )
					.attr( 'value', notFmElementValue )
			);

			var setting = new wp.customize.Setting( settingId, settingValue, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			var control = new wp.customize.Control( settingId, {
				setting: setting,
				params: {
					content: markup,
					settings: { 'default': setting.id },
					type: 'fieldmanager-beta',
				}
			});

			assert.ok( fm.beta.customize.setControl( control ), 'successfully returned setting' );
			assert.ok( -1 !== setting.get().indexOf( fmElementValue ), 'setting now contains "fm-element" value' );
			assert.ok( -1 === setting.get().indexOf( notFmElementValue ), 'setting does not contain "not-fm-element" value' );
		});

		QUnit.test( 'setControl sets value with serializeJSON()', function ( assert ) {
			var settingId = 'option_fields';
			var textValue = randStr();

			var expected = {
				0: {
					'repeatable_group': {
						0: {
							'text': textValue,
						}
					}
				}
			};

			var setting = new wp.customize.Setting( settingId, '', {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			var control = new wp.customize.Control( settingId, {
				setting: setting,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'name', 'option_fields[0][repeatable_group][0][text]' )
							.attr( 'value', textValue )
					),
					settings: { 'default': setting.id },
					type: 'fieldmanager-beta',
				}
			});

			fm.beta.customize.setControl( control );
			assert.deepEqual( setting.get(), expected );
		});

		QUnit.test( 'setControl falls back to serialize()', function ( assert ) {
			var plugin = $.fn.serializeJSON;
			$.fn.serializeJSON = undefined;

			var settingId = 'option_fields';
			var textValue = randStr();

			var expected = 'option_fields%5B0%5D%5Brepeatable_group%5D%5B0%5D%5Btext%5D=' + textValue;

			var setting = new wp.customize.Setting( settingId, '', {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			var control = new wp.customize.Control( settingId, {
				setting: setting,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'name', 'option_fields[0][repeatable_group][0][text]' )
							.attr( 'value', textValue )
					),
					settings: { 'default': setting.id },
					type: 'fieldmanager-beta',
				}
			});

			fm.beta.customize.setControl( control );
			assert.strictEqual( setting.get(), expected );

			$.fn.serializeJSON = plugin;
		});

		QUnit.test( 'setControlsContainingElement() sets only controls containing element', function ( assert ) {
			var initialValue = randStr();
			var newValue = randStr();
			var id1 = randStr();
			var id2 = randStr();

			var setting1 = wp.customize.create( id1, id1, initialValue, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			} );

			var $element1 = $( '<input />' )
				.addClass( 'fm-element' )
				.attr( 'name', id1 )
				.attr( 'value', newValue );

			var control1 = wp.customize.control.create( id1, id1, {
				setting: setting1,
				params: {
					content: $( '<li>' ).append( $element1 ),
					settings: { 'default': setting1.id },
					type: 'fieldmanager-beta',
				},
			});

			var setting2 = wp.customize.create( id2, id2, initialValue, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			var control2 = wp.customize.control.create( id2, id2, {
				setting: setting2,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'name', id2 )
							.attr( 'value', newValue )
					),
					settings: { 'default': setting2.id },
					type: 'fieldmanager-beta',
				}
			});

			fm.beta.customize.setControlsContainingElement( $element1 );
			assert.equal( setting1.get(), newValue, 'First setting value was in the control and should change' );
			assert.equal( setting2.get(), initialValue, 'Second setting value was not in the control and should not change' );
		});

		QUnit.test( 'setEachControl should set each control', function ( assert ) {
			var id1 = randStr();
			var initialValue1 = randStr();
			var newValue1 = randStr();

			var id2 = randStr();
			var initialValue2 = randStr();
			var newValue2 = randStr();

			var setting1 = wp.customize.create( id1, id1, initialValue1, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			} );

			wp.customize.control.create( id1, id1, {
				setting: setting1,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'name', id1 )
							.attr( 'value', newValue1 )
					 ),
					settings: { 'default': setting1.id },
					type: 'fieldmanager-beta',
				},
			});

			var setting2 = wp.customize.create( id2, id2, initialValue2, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			wp.customize.control.create( id2, id2, {
				setting: setting2,
				params: {
					content: $( '<li>' ).append(
						$( '<input />' )
							.addClass( 'fm-element' )
							.attr( 'name', id2 )
							.attr( 'value', newValue2 )
					),
					settings: { 'default': setting2.id },
					type: 'fieldmanager-beta',
				}
			});

			fm.beta.customize.setEachControl();
			assert.equal( setting1.get(), newValue1, 'First setting value changed' );
			assert.equal( setting2.get(), newValue2, 'Second setting value changed' );
		});
	});

	QUnit.module( 'Events', function ( hooks ) {
		var initialValue = 'Wrong';
		var expected = 'First';
		var id = 'customize-text';

		hooks.beforeEach(function( assert ) {
			var setting = wp.customize.create( id, id, initialValue, {
				transport: 'noop',
				previewer: wp.customize.previewer,
			});

			wp.customize.control.create( id, id, {
				setting: setting,
				params: {
					content: $( document ).find( '#customizer-events' ),
					settings: { 'default': setting.id },
					type: 'fieldmanager-beta',
				}
			});

			wp.customize.trigger( 'ready' );
		});

		hooks.afterEach(function( assert ) {
			wp.customize.remove( id );
			wp.customize.control.remove( id );
		});

		function assertStrictEqualSettingValue( assert ) {
			assert.strictEqual( wp.customize.instance( id ).get(), expected, 'Setting value updated' );
		}

		QUnit.test( '.fm-element keyup', function ( assert ) {
			var done = assert.async();
			$( document ).find( '#customizer-events' ).find( '.fm-element' ).trigger( 'keyup' );
			// Account for the _.debounce() attached to this event.
			setTimeout(function() {
				assertStrictEqualSettingValue( assert );
				done();
			}, 500 );
		});

		QUnit.test( '.fm-autocomplete keyup', function ( assert ) {
			$( document ).find( '#customizer-events' ).find( '.fm-autocomplete' ).trigger( 'keyup' );
			// This in itself should *not* trigger a change.
			assert.strictEqual( wp.customize.instance( id ).get(), initialValue, 'Setting value unchanged' );
		});

		QUnit.test( '.fm-element change', function ( assert ) {
			$( document ).find( '#customizer-events' ).find( '.fm-element' ).trigger( 'change' );
			assertStrictEqualSettingValue( assert );
		});

		QUnit.test( '.fm-media-remove click', function ( assert ) {
			$( document ).find( '#customizer-events').find( '.fm-media-remove' ).trigger( 'click' );
			assertStrictEqualSettingValue( assert );
		});

		QUnit.test( '.fmjs-remove click', function ( assert ) {
			$( document ).find( '#customizer-events').find( '.fmjs-remove' ).trigger( 'click' );
			assertStrictEqualSettingValue( assert );
		});

		QUnit.test( 'fm_sortable_drop', function ( assert ) {
			$( document ).trigger( 'fm_sortable_drop', $( document ).find( '#customizer-events' ).find( '.fm-element' )[0] );
			assertStrictEqualSettingValue( assert );
		});

		QUnit.test( 'fieldmanager_media_preview', function ( assert ) {
			$( document ).find( '#customizer-events' ).find( '.fm-element' ).trigger( 'fieldmanager_media_preview' );
			assertStrictEqualSettingValue( assert );
		});

		// Needs a test with TinyMCE.
		// QUnit.test( 'fm_richtext_init', function ( assert ) {
		// });

		// Needs a test with a Colorpicker.
		// QUnit.test( 'fm_colorpicker_update', function ( assert ) {
		// });
	});
})( window.QUnit, window.jQuery );
