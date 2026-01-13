import { MobileDatePicker } from './chunk-3YQXULD4.js';
import { DesktopDatePicker } from './chunk-WCQF4YK5.js';
import './chunk-HIUUD5QW.js';
import {
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  DatePickerToolbar,
  datePickerToolbarClasses,
  refType_default,
} from './chunk-WKCZBDM3.js';
import './chunk-Q2BLGLKS.js';
import './chunk-YFKCVA7Y.js';
import './chunk-BBFLCO4T.js';
import './chunk-5EV6455O.js';
import './chunk-KIUXAB3T.js';
import { useMediaQuery_default } from './chunk-6VVLSDVC.js';
import './chunk-ELPKKK5T.js';
import './chunk-RW3ODJPB.js';
import './chunk-YAKPBAWK.js';
import './chunk-O7XXZBRM.js';
import './chunk-DRP53DCM.js';
import './chunk-4CCMJV5S.js';
import './chunk-GECYBC44.js';
import './chunk-LOZHJMDH.js';
import './chunk-YCQW72G4.js';
import './chunk-X2ZZOHFS.js';
import './chunk-BCIWU46Y.js';
import './chunk-AOW7Q6QM.js';
import './chunk-IBWUGY4Z.js';
import './chunk-EEDGUGQ2.js';
import './chunk-H4LBJWGQ.js';
import { useThemeProps } from './chunk-CGKS3U7E.js';
import './chunk-7XVPDTUF.js';
import './chunk-R4FCYQTX.js';
import './chunk-SCD7GONV.js';
import './chunk-FRNZCGJX.js';
import './chunk-TAPUFPH2.js';
import './chunk-TA6DHASC.js';
import { _objectWithoutPropertiesLoose } from './chunk-AVUONKA5.js';
import './chunk-T6TWKK6U.js';
import './chunk-TFGIUI32.js';
import './chunk-2MDRTEDQ.js';
import './chunk-HCCYQG5V.js';
import './chunk-43F3PPJC.js';
import './chunk-TLMSET2H.js';
import './chunk-VIOYBTRK.js';
import './chunk-SGNGXQRB.js';
import './chunk-HB5N4A5P.js';
import './chunk-KVEJKEZ5.js';
import './chunk-SCZ4OLDJ.js';
import './chunk-4AUH2Y2D.js';
import './chunk-2KHBIA62.js';
import { require_prop_types } from './chunk-QDMWOECB.js';
import './chunk-4LSKKDHM.js';
import { _extends } from './chunk-HQ6ZTAWL.js';
import { require_jsx_runtime } from './chunk-3UUIVEWB.js';
import { require_react } from './chunk-QJ3FMQXC.js';
import { __toESM } from './chunk-SNAQBZPT.js';

// node_modules/@mui/x-date-pickers/DatePicker/DatePicker.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ['desktopModeMediaQuery'];
var DatePicker = React.forwardRef(function DatePicker2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDatePicker',
  });
  const { desktopModeMediaQuery = DEFAULT_DESKTOP_MODE_MEDIA_QUERY } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const isDesktop = useMediaQuery_default(desktopModeMediaQuery, {
    defaultMatches: true,
  });
  if (isDesktop) {
    return (0, import_jsx_runtime.jsx)(
      DesktopDatePicker,
      _extends(
        {
          ref,
        },
        other
      )
    );
  }
  return (0, import_jsx_runtime.jsx)(
    MobileDatePicker,
    _extends(
      {
        ref,
      },
      other
    )
  );
});
true
  ? (DatePicker.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * If `true`, the main element is focused during the first mount.
       * This main element is:
       * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
       * - the `input` element if there is a field rendered.
       */
      autoFocus: import_prop_types.default.bool,
      className: import_prop_types.default.string,
      /**
       * If `true`, the popover or modal will close after submitting the full date.
       * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
       */
      closeOnSelect: import_prop_types.default.bool,
      /**
       * Formats the day of week displayed in the calendar header.
       * @param {TDate} date The date of the day of week provided by the adapter.
       * @returns {string} The name to display.
       * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
       */
      dayOfWeekFormatter: import_prop_types.default.func,
      /**
       * The default value.
       * Used when the component is not controlled.
       */
      defaultValue: import_prop_types.default.object,
      /**
       * CSS media query when `Mobile` mode will be changed to `Desktop`.
       * @default '@media (pointer: fine)'
       * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
       */
      desktopModeMediaQuery: import_prop_types.default.string,
      /**
       * If `true`, the picker and text field are disabled.
       * @default false
       */
      disabled: import_prop_types.default.bool,
      /**
       * If `true`, disable values after the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disableFuture: import_prop_types.default.bool,
      /**
       * If `true`, today's date is rendering without highlighting with circle.
       * @default false
       */
      disableHighlightToday: import_prop_types.default.bool,
      /**
       * If `true`, the open picker button will not be rendered (renders only the field).
       * @default false
       */
      disableOpenPicker: import_prop_types.default.bool,
      /**
       * If `true`, disable values before the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disablePast: import_prop_types.default.bool,
      /**
       * If `true`, the week number will be display in the calendar.
       */
      displayWeekNumber: import_prop_types.default.bool,
      /**
       * @default false
       */
      enableAccessibleFieldDOMStructure: import_prop_types.default.any,
      /**
       * The day view will show as many weeks as needed after the end of the current month to match this value.
       * Put it to 6 to have a fixed number of weeks in Gregorian calendars
       */
      fixedWeekNumber: import_prop_types.default.number,
      /**
       * Format of the date when rendered in the input(s).
       * Defaults to localized format based on the used `views`.
       */
      format: import_prop_types.default.string,
      /**
       * Density of the format when rendered in the input.
       * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
       * @default "dense"
       */
      formatDensity: import_prop_types.default.oneOf(['dense', 'spacious']),
      /**
       * Pass a ref to the `input` element.
       */
      inputRef: refType_default,
      /**
       * The label content.
       */
      label: import_prop_types.default.node,
      /**
       * If `true`, calls `renderLoading` instead of rendering the day calendar.
       * Can be used to preload information and show it in calendar.
       * @default false
       */
      loading: import_prop_types.default.bool,
      /**
       * Locale for components texts.
       * Allows overriding texts coming from `LocalizationProvider` and `theme`.
       */
      localeText: import_prop_types.default.object,
      /**
       * Maximal selectable date.
       * @default 2099-12-31
       */
      maxDate: import_prop_types.default.object,
      /**
       * Minimal selectable date.
       * @default 1900-01-01
       */
      minDate: import_prop_types.default.object,
      /**
       * Months rendered per row.
       * @default 3
       */
      monthsPerRow: import_prop_types.default.oneOf([3, 4]),
      /**
       * Name attribute used by the `input` element in the Field.
       */
      name: import_prop_types.default.string,
      /**
       * Callback fired when the value is accepted.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
       * @param {TValue} value The value that was just accepted.
       * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
       */
      onAccept: import_prop_types.default.func,
      /**
       * Callback fired when the value changes.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
       * @param {TValue} value The new value.
       * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
       */
      onChange: import_prop_types.default.func,
      /**
       * Callback fired when the popup requests to be closed.
       * Use in controlled mode (see `open`).
       */
      onClose: import_prop_types.default.func,
      /**
       * Callback fired when the error associated with the current value changes.
       * When a validation error is detected, the `error` parameter contains a non-null value.
       * This can be used to render an appropriate form error.
       * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @param {TError} error The reason why the current value is not valid.
       * @param {TValue} value The value associated with the error.
       */
      onError: import_prop_types.default.func,
      /**
       * Callback fired on month change.
       * @template TDate
       * @param {TDate} month The new month.
       */
      onMonthChange: import_prop_types.default.func,
      /**
       * Callback fired when the popup requests to be opened.
       * Use in controlled mode (see `open`).
       */
      onOpen: import_prop_types.default.func,
      /**
       * Callback fired when the selected sections change.
       * @param {FieldSelectedSections} newValue The new selected sections.
       */
      onSelectedSectionsChange: import_prop_types.default.func,
      /**
       * Callback fired on view change.
       * @template TView
       * @param {TView} view The new view.
       */
      onViewChange: import_prop_types.default.func,
      /**
       * Callback fired on year change.
       * @template TDate
       * @param {TDate} year The new year.
       */
      onYearChange: import_prop_types.default.func,
      /**
       * Control the popup or dialog open state.
       * @default false
       */
      open: import_prop_types.default.bool,
      /**
       * The default visible view.
       * Used when the component view is not controlled.
       * Must be a valid option from `views` list.
       */
      openTo: import_prop_types.default.oneOf(['day', 'month', 'year']),
      /**
       * Force rendering in particular orientation.
       */
      orientation: import_prop_types.default.oneOf(['landscape', 'portrait']),
      readOnly: import_prop_types.default.bool,
      /**
       * If `true`, disable heavy animations.
       * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
       */
      reduceAnimations: import_prop_types.default.bool,
      /**
       * The date used to generate the new value when both `value` and `defaultValue` are empty.
       * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
       */
      referenceDate: import_prop_types.default.object,
      /**
       * Component displaying when passed `loading` true.
       * @returns {React.ReactNode} The node to render when loading.
       * @default () => <span>...</span>
       */
      renderLoading: import_prop_types.default.func,
      /**
       * The currently selected sections.
       * This prop accepts four formats:
       * 1. If a number is provided, the section at this index will be selected.
       * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
       * 3. If `"all"` is provided, all the sections will be selected.
       * 4. If `null` is provided, no section will be selected.
       * If not provided, the selected sections will be handled internally.
       */
      selectedSections: import_prop_types.default.oneOfType([
        import_prop_types.default.oneOf([
          'all',
          'day',
          'empty',
          'hours',
          'meridiem',
          'minutes',
          'month',
          'seconds',
          'weekDay',
          'year',
        ]),
        import_prop_types.default.number,
      ]),
      /**
       * Disable specific date.
       *
       * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
       *
       * @template TDate
       * @param {TDate} day The date to test.
       * @returns {boolean} If `true` the date will be disabled.
       */
      shouldDisableDate: import_prop_types.default.func,
      /**
       * Disable specific month.
       * @template TDate
       * @param {TDate} month The month to test.
       * @returns {boolean} If `true`, the month will be disabled.
       */
      shouldDisableMonth: import_prop_types.default.func,
      /**
       * Disable specific year.
       * @template TDate
       * @param {TDate} year The year to test.
       * @returns {boolean} If `true`, the year will be disabled.
       */
      shouldDisableYear: import_prop_types.default.func,
      /**
       * If `true`, days outside the current month are rendered:
       *
       * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
       *
       * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
       *
       * - ignored if `calendars` equals more than `1` on range pickers.
       * @default false
       */
      showDaysOutsideCurrentMonth: import_prop_types.default.bool,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types.default.oneOfType([
        import_prop_types.default.arrayOf(
          import_prop_types.default.oneOfType([
            import_prop_types.default.func,
            import_prop_types.default.object,
            import_prop_types.default.bool,
          ])
        ),
        import_prop_types.default.func,
        import_prop_types.default.object,
      ]),
      /**
       * Choose which timezone to use for the value.
       * Example: "default", "system", "UTC", "America/New_York".
       * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
       * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
       * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
       */
      timezone: import_prop_types.default.string,
      /**
       * The selected value.
       * Used when the component is controlled.
       */
      value: import_prop_types.default.object,
      /**
       * The visible view.
       * Used when the component view is controlled.
       * Must be a valid option from `views` list.
       */
      view: import_prop_types.default.oneOf(['day', 'month', 'year']),
      /**
       * Define custom view renderers for each section.
       * If `null`, the section will only have field editing.
       * If `undefined`, internally defined view will be used.
       */
      viewRenderers: import_prop_types.default.shape({
        day: import_prop_types.default.func,
        month: import_prop_types.default.func,
        year: import_prop_types.default.func,
      }),
      /**
       * Available views.
       */
      views: import_prop_types.default.arrayOf(
        import_prop_types.default.oneOf(['day', 'month', 'year']).isRequired
      ),
      /**
       * Years are displayed in ascending (chronological) order by default.
       * If `desc`, years are displayed in descending order.
       * @default 'asc'
       */
      yearsOrder: import_prop_types.default.oneOf(['asc', 'desc']),
      /**
       * Years rendered per row.
       * @default 4 on desktop, 3 on mobile
       */
      yearsPerRow: import_prop_types.default.oneOf([3, 4]),
    })
  : void 0;
export { DatePicker, DatePickerToolbar, datePickerToolbarClasses };
//# sourceMappingURL=@mui_x-date-pickers_DatePicker.js.map
