import {
  ClearIcon,
  DATE_TIME_VALIDATION_PROP_NAMES,
  DATE_VALIDATION_PROP_NAMES,
  TIME_VALIDATION_PROP_NAMES,
  adjustSectionValue,
  applyDefaultDate,
  applyLocalizedDigits,
  capitalize,
  changeSectionValueFormat,
  cleanDigitSectionValue,
  cleanLeadingZeros,
  composeClasses,
  doesSectionFormatHaveLeadingZeros,
  generateUtilityClass,
  generateUtilityClasses,
  getActiveElement,
  getDateFromDateSections,
  getDateSectionConfigFromFormatToken,
  getDaysInWeekStr,
  getLetterEditingOptions,
  getLocalizedDigits,
  getSectionOrder,
  getSectionTypeGranularity,
  getSectionValueNow,
  getSectionValueText,
  getSectionVisibleValue,
  getSectionsBoundaries,
  isAndroid,
  isStringNumber,
  mergeDateIntoReferenceDate,
  parseSelectedSections,
  refType_default,
  removeLocalizedDigits,
  singleItemFieldValueManager,
  singleItemValueManager,
  useControlled,
  useDefaultDates,
  useEnhancedEffect_default,
  useEventCallback_default,
  useForkRef,
  useId,
  useLocalizationContext,
  usePickersTranslations,
  useSlotProps_default,
  useUtils,
  useValidation,
  useValueWithTimezone,
  validateDate,
  validateSections,
  visuallyHidden_default,
} from './chunk-WKCZBDM3.js';
import { LocalizationProvider } from './chunk-YFKCVA7Y.js';
import { InputAdornment_default } from './chunk-5EV6455O.js';
import { InputLabel_default, TextField_default } from './chunk-KIUXAB3T.js';
import { FormControl_default } from './chunk-RW3ODJPB.js';
import { FormHelperText_default } from './chunk-YAKPBAWK.js';
import { IconButton_default } from './chunk-YCQW72G4.js';
import { useThemeProps } from './chunk-CGKS3U7E.js';
import { useFormControl } from './chunk-R4FCYQTX.js';
import { _objectWithoutPropertiesLoose } from './chunk-AVUONKA5.js';
import { styled_default } from './chunk-SCZ4OLDJ.js';
import { shouldForwardProp, useRtl } from './chunk-4AUH2Y2D.js';
import { clsx_default } from './chunk-2KHBIA62.js';
import { require_prop_types } from './chunk-QDMWOECB.js';
import { _extends } from './chunk-HQ6ZTAWL.js';
import { require_jsx_runtime } from './chunk-3UUIVEWB.js';
import { require_react } from './chunk-QJ3FMQXC.js';
import { __toESM } from './chunk-SNAQBZPT.js';

// node_modules/@mui/x-date-pickers/DateField/DateField.js
var React18 = __toESM(require_react());
var import_prop_types7 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useField.js
var React5 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useFieldState.js
var React = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/hooks/useField/buildSectionsFromFormat.js
var expandFormat = ({ utils, format }) => {
  let formatExpansionOverflow = 10;
  let prevFormat = format;
  let nextFormat = utils.expandFormat(format);
  while (nextFormat !== prevFormat) {
    prevFormat = nextFormat;
    nextFormat = utils.expandFormat(prevFormat);
    formatExpansionOverflow -= 1;
    if (formatExpansionOverflow < 0) {
      throw new Error(
        'MUI X: The format expansion seems to be in an infinite loop. Please open an issue with the format passed to the picker component.'
      );
    }
  }
  return nextFormat;
};
var getEscapedPartsFromFormat = ({ utils, expandedFormat }) => {
  const escapedParts = [];
  const { start: startChar, end: endChar } = utils.escapedCharacters;
  const regExp = new RegExp(`(\\${startChar}[^\\${endChar}]*\\${endChar})+`, 'g');
  let match = null;
  while ((match = regExp.exec(expandedFormat))) {
    escapedParts.push({
      start: match.index,
      end: regExp.lastIndex - 1,
    });
  }
  return escapedParts;
};
var getSectionPlaceholder = (utils, localeText, sectionConfig, sectionFormat) => {
  switch (sectionConfig.type) {
    case 'year': {
      return localeText.fieldYearPlaceholder({
        digitAmount: utils.formatByString(utils.date(void 0, 'default'), sectionFormat).length,
        format: sectionFormat,
      });
    }
    case 'month': {
      return localeText.fieldMonthPlaceholder({
        contentType: sectionConfig.contentType,
        format: sectionFormat,
      });
    }
    case 'day': {
      return localeText.fieldDayPlaceholder({
        format: sectionFormat,
      });
    }
    case 'weekDay': {
      return localeText.fieldWeekDayPlaceholder({
        contentType: sectionConfig.contentType,
        format: sectionFormat,
      });
    }
    case 'hours': {
      return localeText.fieldHoursPlaceholder({
        format: sectionFormat,
      });
    }
    case 'minutes': {
      return localeText.fieldMinutesPlaceholder({
        format: sectionFormat,
      });
    }
    case 'seconds': {
      return localeText.fieldSecondsPlaceholder({
        format: sectionFormat,
      });
    }
    case 'meridiem': {
      return localeText.fieldMeridiemPlaceholder({
        format: sectionFormat,
      });
    }
    default: {
      return sectionFormat;
    }
  }
};
var createSection = ({
  utils,
  date,
  shouldRespectLeadingZeros,
  localeText,
  localizedDigits,
  now,
  token,
  startSeparator,
}) => {
  if (token === '') {
    throw new Error('MUI X: Should not call `commitToken` with an empty token');
  }
  const sectionConfig = getDateSectionConfigFromFormatToken(utils, token);
  const hasLeadingZerosInFormat = doesSectionFormatHaveLeadingZeros(
    utils,
    sectionConfig.contentType,
    sectionConfig.type,
    token
  );
  const hasLeadingZerosInInput = shouldRespectLeadingZeros
    ? hasLeadingZerosInFormat
    : sectionConfig.contentType === 'digit';
  const isValidDate = date != null && utils.isValid(date);
  let sectionValue = isValidDate ? utils.formatByString(date, token) : '';
  let maxLength = null;
  if (hasLeadingZerosInInput) {
    if (hasLeadingZerosInFormat) {
      maxLength =
        sectionValue === '' ? utils.formatByString(now, token).length : sectionValue.length;
    } else {
      if (sectionConfig.maxLength == null) {
        throw new Error(
          `MUI X: The token ${token} should have a 'maxDigitNumber' property on it's adapter`
        );
      }
      maxLength = sectionConfig.maxLength;
      if (isValidDate) {
        sectionValue = applyLocalizedDigits(
          cleanLeadingZeros(removeLocalizedDigits(sectionValue, localizedDigits), maxLength),
          localizedDigits
        );
      }
    }
  }
  return _extends({}, sectionConfig, {
    format: token,
    maxLength,
    value: sectionValue,
    placeholder: getSectionPlaceholder(utils, localeText, sectionConfig, token),
    hasLeadingZerosInFormat,
    hasLeadingZerosInInput,
    startSeparator,
    endSeparator: '',
    modified: false,
  });
};
var buildSections = (params) => {
  var _a;
  const { utils, expandedFormat, escapedParts } = params;
  const now = utils.date(void 0);
  const sections = [];
  let startSeparator = '';
  const validTokens = Object.keys(utils.formatTokenMap).sort((a, b) => b.length - a.length);
  const regExpFirstWordInFormat = /^([a-zA-Z]+)/;
  const regExpWordOnlyComposedOfTokens = new RegExp(`^(${validTokens.join('|')})*$`);
  const regExpFirstTokenInWord = new RegExp(`^(${validTokens.join('|')})`);
  const getEscapedPartOfCurrentChar = (i2) =>
    escapedParts.find((escapeIndex) => escapeIndex.start <= i2 && escapeIndex.end >= i2);
  let i = 0;
  while (i < expandedFormat.length) {
    const escapedPartOfCurrentChar = getEscapedPartOfCurrentChar(i);
    const isEscapedChar = escapedPartOfCurrentChar != null;
    const firstWordInFormat =
      (_a = regExpFirstWordInFormat.exec(expandedFormat.slice(i))) == null ? void 0 : _a[1];
    if (
      !isEscapedChar &&
      firstWordInFormat != null &&
      regExpWordOnlyComposedOfTokens.test(firstWordInFormat)
    ) {
      let word = firstWordInFormat;
      while (word.length > 0) {
        const firstWord = regExpFirstTokenInWord.exec(word)[1];
        word = word.slice(firstWord.length);
        sections.push(
          createSection(
            _extends({}, params, {
              now,
              token: firstWord,
              startSeparator,
            })
          )
        );
        startSeparator = '';
      }
      i += firstWordInFormat.length;
    } else {
      const char = expandedFormat[i];
      const isEscapeBoundary =
        (isEscapedChar &&
          (escapedPartOfCurrentChar == null ? void 0 : escapedPartOfCurrentChar.start) === i) ||
        (escapedPartOfCurrentChar == null ? void 0 : escapedPartOfCurrentChar.end) === i;
      if (!isEscapeBoundary) {
        if (sections.length === 0) {
          startSeparator += char;
        } else {
          sections[sections.length - 1].endSeparator += char;
        }
      }
      i += 1;
    }
  }
  if (sections.length === 0 && startSeparator.length > 0) {
    sections.push({
      type: 'empty',
      contentType: 'letter',
      maxLength: null,
      format: '',
      value: '',
      placeholder: '',
      hasLeadingZerosInFormat: false,
      hasLeadingZerosInInput: false,
      startSeparator,
      endSeparator: '',
      modified: false,
    });
  }
  return sections;
};
var postProcessSections = ({ isRtl, formatDensity, sections }) => {
  return sections.map((section) => {
    const cleanSeparator = (separator) => {
      let cleanedSeparator = separator;
      if (isRtl && cleanedSeparator !== null && cleanedSeparator.includes(' ')) {
        cleanedSeparator = `⁩${cleanedSeparator}⁦`;
      }
      if (formatDensity === 'spacious' && ['/', '.', '-'].includes(cleanedSeparator)) {
        cleanedSeparator = ` ${cleanedSeparator} `;
      }
      return cleanedSeparator;
    };
    section.startSeparator = cleanSeparator(section.startSeparator);
    section.endSeparator = cleanSeparator(section.endSeparator);
    return section;
  });
};
var buildSectionsFromFormat = (params) => {
  let expandedFormat = expandFormat(params);
  if (params.isRtl && params.enableAccessibleFieldDOMStructure) {
    expandedFormat = expandedFormat.split(' ').reverse().join(' ');
  }
  const escapedParts = getEscapedPartsFromFormat(
    _extends({}, params, {
      expandedFormat,
    })
  );
  const sections = buildSections(
    _extends({}, params, {
      expandedFormat,
      escapedParts,
    })
  );
  return postProcessSections(
    _extends({}, params, {
      sections,
    })
  );
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useFieldState.js
var useFieldState = (params) => {
  const utils = useUtils();
  const translations = usePickersTranslations();
  const adapter = useLocalizationContext();
  const isRtl = useRtl();
  const {
    valueManager,
    fieldValueManager,
    valueType,
    validator,
    internalProps,
    internalProps: {
      value: valueProp,
      defaultValue,
      referenceDate: referenceDateProp,
      onChange,
      format,
      formatDensity = 'dense',
      selectedSections: selectedSectionsProp,
      onSelectedSectionsChange,
      shouldRespectLeadingZeros = false,
      timezone: timezoneProp,
      enableAccessibleFieldDOMStructure = false,
    },
  } = params;
  const {
    timezone,
    value: valueFromTheOutside,
    handleValueChange,
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager,
  });
  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);
  const sectionsValueBoundaries = React.useMemo(
    () => getSectionsBoundaries(utils, localizedDigits, timezone),
    [utils, localizedDigits, timezone]
  );
  const getSectionsFromValue = React.useCallback(
    (value, fallbackSections = null) =>
      fieldValueManager.getSectionsFromValue(utils, value, fallbackSections, (date) =>
        buildSectionsFromFormat({
          utils,
          localeText: translations,
          localizedDigits,
          format,
          date,
          formatDensity,
          shouldRespectLeadingZeros,
          enableAccessibleFieldDOMStructure,
          isRtl,
        })
      ),
    [
      fieldValueManager,
      format,
      translations,
      localizedDigits,
      isRtl,
      shouldRespectLeadingZeros,
      utils,
      formatDensity,
      enableAccessibleFieldDOMStructure,
    ]
  );
  const [state, setState] = React.useState(() => {
    const sections = getSectionsFromValue(valueFromTheOutside);
    validateSections(sections, valueType);
    const stateWithoutReferenceDate = {
      sections,
      value: valueFromTheOutside,
      referenceValue: valueManager.emptyValue,
      tempValueStrAndroid: null,
    };
    const granularity = getSectionTypeGranularity(sections);
    const referenceValue = valueManager.getInitialReferenceValue({
      referenceDate: referenceDateProp,
      value: valueFromTheOutside,
      utils,
      props: internalProps,
      granularity,
      timezone,
    });
    return _extends({}, stateWithoutReferenceDate, {
      referenceValue,
    });
  });
  const [selectedSections, innerSetSelectedSections] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'useField',
    state: 'selectedSections',
  });
  const setSelectedSections = (newSelectedSections) => {
    innerSetSelectedSections(newSelectedSections);
    onSelectedSectionsChange == null ? void 0 : onSelectedSectionsChange(newSelectedSections);
  };
  const parsedSelectedSections = React.useMemo(
    () => parseSelectedSections(selectedSections, state.sections),
    [selectedSections, state.sections]
  );
  const activeSectionIndex = parsedSelectedSections === 'all' ? 0 : parsedSelectedSections;
  const publishValue = ({ value, referenceValue, sections }) => {
    setState((prevState) =>
      _extends({}, prevState, {
        sections,
        value,
        referenceValue,
        tempValueStrAndroid: null,
      })
    );
    if (valueManager.areValuesEqual(utils, state.value, value)) {
      return;
    }
    const context = {
      validationError: validator({
        adapter,
        value,
        timezone,
        props: internalProps,
      }),
    };
    handleValueChange(value, context);
  };
  const setSectionValue = (sectionIndex, newSectionValue) => {
    const newSections = [...state.sections];
    newSections[sectionIndex] = _extends({}, newSections[sectionIndex], {
      value: newSectionValue,
      modified: true,
    });
    return newSections;
  };
  const clearValue = () => {
    publishValue({
      value: valueManager.emptyValue,
      referenceValue: state.referenceValue,
      sections: getSectionsFromValue(valueManager.emptyValue),
    });
  };
  const clearActiveSection = () => {
    if (activeSectionIndex == null) {
      return;
    }
    const activeSection = state.sections[activeSectionIndex];
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const nonEmptySectionCountBefore = activeDateManager
      .getSections(state.sections)
      .filter((section) => section.value !== '').length;
    const hasNoOtherNonEmptySections =
      nonEmptySectionCountBefore === (activeSection.value === '' ? 0 : 1);
    const newSections = setSectionValue(activeSectionIndex, '');
    const newActiveDate = hasNoOtherNonEmptySections ? null : utils.getInvalidDate();
    const newValues = activeDateManager.getNewValuesFromNewActiveDate(newActiveDate);
    publishValue(
      _extends({}, newValues, {
        sections: newSections,
      })
    );
  };
  const updateValueFromValueStr = (valueStr) => {
    const parseDateStr = (dateStr, referenceDate) => {
      const date = utils.parse(dateStr, format);
      if (date == null || !utils.isValid(date)) {
        return null;
      }
      const sections = buildSectionsFromFormat({
        utils,
        localeText: translations,
        localizedDigits,
        format,
        date,
        formatDensity,
        shouldRespectLeadingZeros,
        enableAccessibleFieldDOMStructure,
        isRtl,
      });
      return mergeDateIntoReferenceDate(utils, date, sections, referenceDate, false);
    };
    const newValue = fieldValueManager.parseValueStr(valueStr, state.referenceValue, parseDateStr);
    const newReferenceValue = fieldValueManager.updateReferenceValue(
      utils,
      newValue,
      state.referenceValue
    );
    publishValue({
      value: newValue,
      referenceValue: newReferenceValue,
      sections: getSectionsFromValue(newValue, state.sections),
    });
  };
  const updateSectionValue = ({ activeSection, newSectionValue, shouldGoToNextSection }) => {
    if (shouldGoToNextSection && activeSectionIndex < state.sections.length - 1) {
      setSelectedSections(activeSectionIndex + 1);
    }
    const activeDateManager = fieldValueManager.getActiveDateManager(utils, state, activeSection);
    const newSections = setSectionValue(activeSectionIndex, newSectionValue);
    const newActiveDateSections = activeDateManager.getSections(newSections);
    const newActiveDate = getDateFromDateSections(utils, newActiveDateSections, localizedDigits);
    let values;
    let shouldPublish;
    if (newActiveDate != null && utils.isValid(newActiveDate)) {
      const mergedDate = mergeDateIntoReferenceDate(
        utils,
        newActiveDate,
        newActiveDateSections,
        activeDateManager.referenceDate,
        true
      );
      values = activeDateManager.getNewValuesFromNewActiveDate(mergedDate);
      shouldPublish = true;
    } else {
      values = activeDateManager.getNewValuesFromNewActiveDate(newActiveDate);
      shouldPublish =
        (newActiveDate != null && !utils.isValid(newActiveDate)) !==
        (activeDateManager.date != null && !utils.isValid(activeDateManager.date));
    }
    if (shouldPublish) {
      return publishValue(
        _extends({}, values, {
          sections: newSections,
        })
      );
    }
    return setState((prevState) =>
      _extends({}, prevState, values, {
        sections: newSections,
        tempValueStrAndroid: null,
      })
    );
  };
  const setTempAndroidValueStr = (tempValueStrAndroid) =>
    setState((prev) =>
      _extends({}, prev, {
        tempValueStrAndroid,
      })
    );
  React.useEffect(() => {
    const sections = getSectionsFromValue(state.value);
    validateSections(sections, valueType);
    setState((prevState) =>
      _extends({}, prevState, {
        sections,
      })
    );
  }, [format, utils.locale, isRtl]);
  React.useEffect(() => {
    let shouldUpdate;
    if (!valueManager.areValuesEqual(utils, state.value, valueFromTheOutside)) {
      shouldUpdate = true;
    } else {
      shouldUpdate =
        valueManager.getTimezone(utils, state.value) !==
        valueManager.getTimezone(utils, valueFromTheOutside);
    }
    if (shouldUpdate) {
      setState((prevState) =>
        _extends({}, prevState, {
          value: valueFromTheOutside,
          referenceValue: fieldValueManager.updateReferenceValue(
            utils,
            valueFromTheOutside,
            prevState.referenceValue
          ),
          sections: getSectionsFromValue(valueFromTheOutside),
        })
      );
    }
  }, [valueFromTheOutside]);
  return {
    state,
    activeSectionIndex,
    parsedSelectedSections,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    getSectionsFromValue,
    sectionsValueBoundaries,
    localizedDigits,
    timezone,
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useFieldCharacterEditing.js
var React2 = __toESM(require_react());
var QUERY_LIFE_DURATION_MS = 5e3;
var isQueryResponseWithoutValue = (response) => response.saveQuery != null;
var useFieldCharacterEditing = ({
  sections,
  updateSectionValue,
  sectionsValueBoundaries,
  localizedDigits,
  setTempAndroidValueStr,
  timezone,
}) => {
  const utils = useUtils();
  const [query, setQuery] = React2.useState(null);
  const resetQuery = useEventCallback_default(() => setQuery(null));
  React2.useEffect(() => {
    var _a;
    if (
      query != null &&
      ((_a = sections[query.sectionIndex]) == null ? void 0 : _a.type) !== query.sectionType
    ) {
      resetQuery();
    }
  }, [sections, query, resetQuery]);
  React2.useEffect(() => {
    if (query != null) {
      const timeout = setTimeout(() => resetQuery(), QUERY_LIFE_DURATION_MS);
      return () => {
        clearTimeout(timeout);
      };
    }
    return () => {};
  }, [query, resetQuery]);
  const applyQuery = (
    { keyPressed, sectionIndex },
    getFirstSectionValueMatchingWithQuery,
    isValidQueryValue
  ) => {
    const cleanKeyPressed = keyPressed.toLowerCase();
    const activeSection = sections[sectionIndex];
    if (
      query != null &&
      (!isValidQueryValue || isValidQueryValue(query.value)) &&
      query.sectionIndex === sectionIndex
    ) {
      const concatenatedQueryValue = `${query.value}${cleanKeyPressed}`;
      const queryResponse2 = getFirstSectionValueMatchingWithQuery(
        concatenatedQueryValue,
        activeSection
      );
      if (!isQueryResponseWithoutValue(queryResponse2)) {
        setQuery({
          sectionIndex,
          value: concatenatedQueryValue,
          sectionType: activeSection.type,
        });
        return queryResponse2;
      }
    }
    const queryResponse = getFirstSectionValueMatchingWithQuery(cleanKeyPressed, activeSection);
    if (isQueryResponseWithoutValue(queryResponse) && !queryResponse.saveQuery) {
      resetQuery();
      return null;
    }
    setQuery({
      sectionIndex,
      value: cleanKeyPressed,
      sectionType: activeSection.type,
    });
    if (isQueryResponseWithoutValue(queryResponse)) {
      return null;
    }
    return queryResponse;
  };
  const applyLetterEditing = (params) => {
    const findMatchingOptions = (format, options, queryValue) => {
      const matchingValues = options.filter((option) =>
        option.toLowerCase().startsWith(queryValue)
      );
      if (matchingValues.length === 0) {
        return {
          saveQuery: false,
        };
      }
      return {
        sectionValue: matchingValues[0],
        shouldGoToNextSection: matchingValues.length === 1,
      };
    };
    const testQueryOnFormatAndFallbackFormat = (
      queryValue,
      activeSection,
      fallbackFormat,
      formatFallbackValue
    ) => {
      const getOptions = (format) =>
        getLetterEditingOptions(utils, timezone, activeSection.type, format);
      if (activeSection.contentType === 'letter') {
        return findMatchingOptions(
          activeSection.format,
          getOptions(activeSection.format),
          queryValue
        );
      }
      if (
        fallbackFormat &&
        formatFallbackValue != null &&
        getDateSectionConfigFromFormatToken(utils, fallbackFormat).contentType === 'letter'
      ) {
        const fallbackOptions = getOptions(fallbackFormat);
        const response = findMatchingOptions(fallbackFormat, fallbackOptions, queryValue);
        if (isQueryResponseWithoutValue(response)) {
          return {
            saveQuery: false,
          };
        }
        return _extends({}, response, {
          sectionValue: formatFallbackValue(response.sectionValue, fallbackOptions),
        });
      }
      return {
        saveQuery: false,
      };
    };
    const getFirstSectionValueMatchingWithQuery = (queryValue, activeSection) => {
      switch (activeSection.type) {
        case 'month': {
          const formatFallbackValue = (fallbackValue) =>
            changeSectionValueFormat(
              utils,
              fallbackValue,
              utils.formats.month,
              activeSection.format
            );
          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            utils.formats.month,
            formatFallbackValue
          );
        }
        case 'weekDay': {
          const formatFallbackValue = (fallbackValue, fallbackOptions) =>
            fallbackOptions.indexOf(fallbackValue).toString();
          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            utils.formats.weekday,
            formatFallbackValue
          );
        }
        case 'meridiem': {
          return testQueryOnFormatAndFallbackFormat(queryValue, activeSection);
        }
        default: {
          return {
            saveQuery: false,
          };
        }
      }
    };
    return applyQuery(params, getFirstSectionValueMatchingWithQuery);
  };
  const applyNumericEditing = (params) => {
    const getNewSectionValue = (queryValue, section) => {
      const cleanQueryValue = removeLocalizedDigits(queryValue, localizedDigits);
      const queryValueNumber = Number(cleanQueryValue);
      const sectionBoundaries = sectionsValueBoundaries[section.type]({
        currentDate: null,
        format: section.format,
        contentType: section.contentType,
      });
      if (queryValueNumber > sectionBoundaries.maximum) {
        return {
          saveQuery: false,
        };
      }
      if (queryValueNumber < sectionBoundaries.minimum) {
        return {
          saveQuery: true,
        };
      }
      const shouldGoToNextSection =
        queryValueNumber * 10 > sectionBoundaries.maximum ||
        cleanQueryValue.length === sectionBoundaries.maximum.toString().length;
      const newSectionValue = cleanDigitSectionValue(
        utils,
        queryValueNumber,
        sectionBoundaries,
        localizedDigits,
        section
      );
      return {
        sectionValue: newSectionValue,
        shouldGoToNextSection,
      };
    };
    const getFirstSectionValueMatchingWithQuery = (queryValue, activeSection) => {
      if (
        activeSection.contentType === 'digit' ||
        activeSection.contentType === 'digit-with-letter'
      ) {
        return getNewSectionValue(queryValue, activeSection);
      }
      if (activeSection.type === 'month') {
        const hasLeadingZerosInFormat = doesSectionFormatHaveLeadingZeros(
          utils,
          'digit',
          'month',
          'MM'
        );
        const response = getNewSectionValue(queryValue, {
          type: activeSection.type,
          format: 'MM',
          hasLeadingZerosInFormat,
          hasLeadingZerosInInput: true,
          contentType: 'digit',
          maxLength: 2,
        });
        if (isQueryResponseWithoutValue(response)) {
          return response;
        }
        const formattedValue = changeSectionValueFormat(
          utils,
          response.sectionValue,
          'MM',
          activeSection.format
        );
        return _extends({}, response, {
          sectionValue: formattedValue,
        });
      }
      if (activeSection.type === 'weekDay') {
        const response = getNewSectionValue(queryValue, activeSection);
        if (isQueryResponseWithoutValue(response)) {
          return response;
        }
        const formattedValue = getDaysInWeekStr(utils, activeSection.format)[
          Number(response.sectionValue) - 1
        ];
        return _extends({}, response, {
          sectionValue: formattedValue,
        });
      }
      return {
        saveQuery: false,
      };
    };
    return applyQuery(params, getFirstSectionValueMatchingWithQuery, (queryValue) =>
      isStringNumber(queryValue, localizedDigits)
    );
  };
  const applyCharacterEditing = useEventCallback_default((params) => {
    const activeSection = sections[params.sectionIndex];
    const isNumericEditing = isStringNumber(params.keyPressed, localizedDigits);
    const response = isNumericEditing
      ? applyNumericEditing(
          _extends({}, params, {
            keyPressed: applyLocalizedDigits(params.keyPressed, localizedDigits),
          })
        )
      : applyLetterEditing(params);
    if (response == null) {
      setTempAndroidValueStr(null);
      return;
    }
    updateSectionValue({
      activeSection,
      newSectionValue: response.sectionValue,
      shouldGoToNextSection: response.shouldGoToNextSection,
    });
  });
  return {
    applyCharacterEditing,
    resetCharacterQuery: resetQuery,
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useFieldV7TextField.js
var React3 = __toESM(require_react());
var useFieldV7TextField = (params) => {
  const {
    internalProps: { disabled, readOnly = false },
    forwardedProps: {
      sectionListRef: inSectionListRef,
      onBlur,
      onClick,
      onFocus,
      onInput,
      onPaste,
      focused: focusedProp,
      autoFocus = false,
    },
    fieldValueManager,
    applyCharacterEditing,
    resetCharacterQuery,
    setSelectedSections,
    parsedSelectedSections,
    state,
    clearActiveSection,
    clearValue,
    updateSectionValue,
    updateValueFromValueStr,
    sectionOrder,
    areAllSectionsEmpty,
    sectionsValueBoundaries,
  } = params;
  const sectionListRef = React3.useRef(null);
  const handleSectionListRef = useForkRef(inSectionListRef, sectionListRef);
  const translations = usePickersTranslations();
  const utils = useUtils();
  const id = useId();
  const [focused, setFocused] = React3.useState(false);
  const interactions = React3.useMemo(
    () => ({
      syncSelectionToDOM: () => {
        if (!sectionListRef.current) {
          return;
        }
        const selection = document.getSelection();
        if (!selection) {
          return;
        }
        if (parsedSelectedSections == null) {
          if (
            selection.rangeCount > 0 &&
            sectionListRef.current.getRoot().contains(selection.getRangeAt(0).startContainer)
          ) {
            selection.removeAllRanges();
          }
          if (focused) {
            sectionListRef.current.getRoot().blur();
          }
          return;
        }
        if (!sectionListRef.current.getRoot().contains(getActiveElement(document))) {
          return;
        }
        const range = new window.Range();
        let target;
        if (parsedSelectedSections === 'all') {
          target = sectionListRef.current.getRoot();
        } else {
          const section = state.sections[parsedSelectedSections];
          if (section.type === 'empty') {
            target = sectionListRef.current.getSectionContainer(parsedSelectedSections);
          } else {
            target = sectionListRef.current.getSectionContent(parsedSelectedSections);
          }
        }
        range.selectNodeContents(target);
        target.focus();
        selection.removeAllRanges();
        selection.addRange(range);
      },
      getActiveSectionIndexFromDOM: () => {
        const activeElement = getActiveElement(document);
        if (
          !activeElement ||
          !sectionListRef.current ||
          !sectionListRef.current.getRoot().contains(activeElement)
        ) {
          return null;
        }
        return sectionListRef.current.getSectionIndexFromDOMElement(activeElement);
      },
      focusField: (newSelectedSections = 0) => {
        if (
          !sectionListRef.current || // if the field is already focused, we don't need to focus it again
          interactions.getActiveSectionIndexFromDOM() != null
        ) {
          return;
        }
        const newParsedSelectedSections = parseSelectedSections(
          newSelectedSections,
          state.sections
        );
        setFocused(true);
        sectionListRef.current.getSectionContent(newParsedSelectedSections).focus();
      },
      setSelectedSections: (newSelectedSections) => {
        if (!sectionListRef.current) {
          return;
        }
        const newParsedSelectedSections = parseSelectedSections(
          newSelectedSections,
          state.sections
        );
        const newActiveSectionIndex =
          newParsedSelectedSections === 'all' ? 0 : newParsedSelectedSections;
        setFocused(newActiveSectionIndex !== null);
        setSelectedSections(newSelectedSections);
      },
      isFieldFocused: () => {
        const activeElement = getActiveElement(document);
        return !!sectionListRef.current && sectionListRef.current.getRoot().contains(activeElement);
      },
    }),
    [parsedSelectedSections, setSelectedSections, state.sections, focused]
  );
  const revertDOMSectionChange = useEventCallback_default((sectionIndex) => {
    if (!sectionListRef.current) {
      return;
    }
    const section = state.sections[sectionIndex];
    sectionListRef.current.getSectionContent(sectionIndex).innerHTML =
      section.value || section.placeholder;
    interactions.syncSelectionToDOM();
  });
  const handleContainerClick = useEventCallback_default((event, ...args) => {
    if (event.isDefaultPrevented() || !sectionListRef.current) {
      return;
    }
    setFocused(true);
    onClick == null ? void 0 : onClick(event, ...args);
    if (parsedSelectedSections === 'all') {
      setTimeout(() => {
        const cursorPosition = document.getSelection().getRangeAt(0).startOffset;
        if (cursorPosition === 0) {
          setSelectedSections(sectionOrder.startIndex);
          return;
        }
        let sectionIndex = 0;
        let cursorOnStartOfSection = 0;
        while (cursorOnStartOfSection < cursorPosition && sectionIndex < state.sections.length) {
          const section = state.sections[sectionIndex];
          sectionIndex += 1;
          cursorOnStartOfSection +=
            `${section.startSeparator}${section.value || section.placeholder}${section.endSeparator}`
              .length;
        }
        setSelectedSections(sectionIndex - 1);
      });
    } else if (!focused) {
      setFocused(true);
      setSelectedSections(sectionOrder.startIndex);
    } else {
      const hasClickedOnASection = sectionListRef.current.getRoot().contains(event.target);
      if (!hasClickedOnASection) {
        setSelectedSections(sectionOrder.startIndex);
      }
    }
  });
  const handleContainerInput = useEventCallback_default((event) => {
    onInput == null ? void 0 : onInput(event);
    if (!sectionListRef.current || parsedSelectedSections !== 'all') {
      return;
    }
    const target = event.target;
    const keyPressed = target.textContent ?? '';
    sectionListRef.current.getRoot().innerHTML = state.sections
      .map(
        (section) =>
          `${section.startSeparator}${section.value || section.placeholder}${section.endSeparator}`
      )
      .join('');
    interactions.syncSelectionToDOM();
    if (keyPressed.length === 0 || keyPressed.charCodeAt(0) === 10) {
      resetCharacterQuery();
      clearValue();
      setSelectedSections('all');
    } else if (keyPressed.length > 1) {
      updateValueFromValueStr(keyPressed);
    } else {
      if (parsedSelectedSections === 'all') {
        setSelectedSections(0);
      }
      applyCharacterEditing({
        keyPressed,
        sectionIndex: 0,
      });
    }
  });
  const handleContainerPaste = useEventCallback_default((event) => {
    onPaste == null ? void 0 : onPaste(event);
    if (readOnly || parsedSelectedSections !== 'all') {
      event.preventDefault();
      return;
    }
    const pastedValue = event.clipboardData.getData('text');
    event.preventDefault();
    resetCharacterQuery();
    updateValueFromValueStr(pastedValue);
  });
  const handleContainerFocus = useEventCallback_default((...args) => {
    onFocus == null ? void 0 : onFocus(...args);
    if (focused || !sectionListRef.current) {
      return;
    }
    setFocused(true);
    const isFocusInsideASection =
      sectionListRef.current.getSectionIndexFromDOMElement(getActiveElement(document)) != null;
    if (!isFocusInsideASection) {
      setSelectedSections(sectionOrder.startIndex);
    }
  });
  const handleContainerBlur = useEventCallback_default((...args) => {
    onBlur == null ? void 0 : onBlur(...args);
    setTimeout(() => {
      if (!sectionListRef.current) {
        return;
      }
      const activeElement = getActiveElement(document);
      const shouldBlur = !sectionListRef.current.getRoot().contains(activeElement);
      if (shouldBlur) {
        setFocused(false);
        setSelectedSections(null);
      }
    });
  });
  const getInputContainerClickHandler = useEventCallback_default((sectionIndex) => (event) => {
    if (event.isDefaultPrevented()) {
      return;
    }
    setSelectedSections(sectionIndex);
  });
  const handleInputContentMouseUp = useEventCallback_default((event) => {
    event.preventDefault();
  });
  const getInputContentFocusHandler = useEventCallback_default((sectionIndex) => () => {
    setSelectedSections(sectionIndex);
  });
  const handleInputContentPaste = useEventCallback_default((event) => {
    event.preventDefault();
    if (readOnly || disabled || typeof parsedSelectedSections !== 'number') {
      return;
    }
    const activeSection = state.sections[parsedSelectedSections];
    const pastedValue = event.clipboardData.getData('text');
    const lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
    const digitsOnly = /^[0-9]+$/.test(pastedValue);
    const digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
    const isValidPastedValue =
      (activeSection.contentType === 'letter' && lettersOnly) ||
      (activeSection.contentType === 'digit' && digitsOnly) ||
      (activeSection.contentType === 'digit-with-letter' && digitsAndLetterOnly);
    if (isValidPastedValue) {
      resetCharacterQuery();
      updateSectionValue({
        activeSection,
        newSectionValue: pastedValue,
        shouldGoToNextSection: true,
      });
    } else if (!lettersOnly && !digitsOnly) {
      resetCharacterQuery();
      updateValueFromValueStr(pastedValue);
    }
  });
  const handleInputContentDragOver = useEventCallback_default((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });
  const handleInputContentInput = useEventCallback_default((event) => {
    if (!sectionListRef.current) {
      return;
    }
    const target = event.target;
    const keyPressed = target.textContent ?? '';
    const sectionIndex = sectionListRef.current.getSectionIndexFromDOMElement(target);
    const section = state.sections[sectionIndex];
    if (readOnly || !sectionListRef.current) {
      revertDOMSectionChange(sectionIndex);
      return;
    }
    if (keyPressed.length === 0) {
      if (section.value === '') {
        revertDOMSectionChange(sectionIndex);
        return;
      }
      const inputType = event.nativeEvent.inputType;
      if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
        revertDOMSectionChange(sectionIndex);
        return;
      }
      resetCharacterQuery();
      clearActiveSection();
      return;
    }
    applyCharacterEditing({
      keyPressed,
      sectionIndex,
    });
    revertDOMSectionChange(sectionIndex);
  });
  useEnhancedEffect_default(() => {
    if (!focused || !sectionListRef.current) {
      return;
    }
    if (parsedSelectedSections === 'all') {
      sectionListRef.current.getRoot().focus();
    } else if (typeof parsedSelectedSections === 'number') {
      const domElement = sectionListRef.current.getSectionContent(parsedSelectedSections);
      if (domElement) {
        domElement.focus();
      }
    }
  }, [parsedSelectedSections, focused]);
  const sectionBoundaries = React3.useMemo(() => {
    return state.sections.reduce((acc, next) => {
      acc[next.type] = sectionsValueBoundaries[next.type]({
        currentDate: null,
        contentType: next.contentType,
        format: next.format,
      });
      return acc;
    }, {});
  }, [sectionsValueBoundaries, state.sections]);
  const isContainerEditable = parsedSelectedSections === 'all';
  const elements = React3.useMemo(() => {
    return state.sections.map((section, index) => {
      const isEditable = !isContainerEditable && !disabled && !readOnly;
      return {
        container: {
          'data-sectionindex': index,
          onClick: getInputContainerClickHandler(index),
        },
        content: {
          tabIndex: isContainerEditable || index > 0 ? -1 : 0,
          contentEditable: !isContainerEditable && !disabled && !readOnly,
          role: 'spinbutton',
          id: `${id}-${section.type}`,
          'aria-labelledby': `${id}-${section.type}`,
          'aria-readonly': readOnly,
          'aria-valuenow': getSectionValueNow(section, utils),
          'aria-valuemin': sectionBoundaries[section.type].minimum,
          'aria-valuemax': sectionBoundaries[section.type].maximum,
          'aria-valuetext': section.value
            ? getSectionValueText(section, utils)
            : translations.empty,
          'aria-label': translations[section.type],
          'aria-disabled': disabled,
          spellCheck: isEditable ? false : void 0,
          autoCapitalize: isEditable ? 'off' : void 0,
          autoCorrect: isEditable ? 'off' : void 0,
          [parseInt(React3.version, 10) >= 17 ? 'enterKeyHint' : 'enterkeyhint']: isEditable
            ? 'next'
            : void 0,
          children: section.value || section.placeholder,
          onInput: handleInputContentInput,
          onPaste: handleInputContentPaste,
          onFocus: getInputContentFocusHandler(index),
          onDragOver: handleInputContentDragOver,
          onMouseUp: handleInputContentMouseUp,
          inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
        },
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
        },
      };
    });
  }, [
    state.sections,
    getInputContentFocusHandler,
    handleInputContentPaste,
    handleInputContentDragOver,
    handleInputContentInput,
    getInputContainerClickHandler,
    handleInputContentMouseUp,
    disabled,
    readOnly,
    isContainerEditable,
    translations,
    utils,
    sectionBoundaries,
    id,
  ]);
  const handleValueStrChange = useEventCallback_default((event) => {
    updateValueFromValueStr(event.target.value);
  });
  const valueStr = React3.useMemo(
    () =>
      areAllSectionsEmpty
        ? ''
        : fieldValueManager.getV7HiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager]
  );
  React3.useEffect(() => {
    if (sectionListRef.current == null) {
      throw new Error(
        [
          'MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`',
          'You probably tried to pass a component to the `textField` slot that contains an `<input />` element instead of a `PickersSectionList`.',
          '',
          'If you want to keep using an `<input />` HTML element for the editing, please remove the `enableAccessibleFieldDOMStructure` prop from your picker or field component:',
          '',
          '<DatePicker slots={{ textField: MyCustomTextField }} />',
          '',
          'Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element',
        ].join('\n')
      );
    }
    if (autoFocus && sectionListRef.current) {
      sectionListRef.current.getSectionContent(sectionOrder.startIndex).focus();
    }
  }, []);
  return {
    interactions,
    returnedValue: {
      // Forwarded
      autoFocus,
      readOnly,
      focused: focusedProp ?? focused,
      sectionListRef: handleSectionListRef,
      onBlur: handleContainerBlur,
      onClick: handleContainerClick,
      onFocus: handleContainerFocus,
      onInput: handleContainerInput,
      onPaste: handleContainerPaste,
      // Additional
      enableAccessibleFieldDOMStructure: true,
      elements,
      // TODO v7: Try to set to undefined when there is a section selected.
      tabIndex: parsedSelectedSections === 0 ? -1 : 0,
      contentEditable: isContainerEditable,
      value: valueStr,
      onChange: handleValueStrChange,
      areAllSectionsEmpty,
    },
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useFieldV6TextField.js
var React4 = __toESM(require_react());
var cleanString = (dirtyString) => dirtyString.replace(/[\u2066\u2067\u2068\u2069]/g, '');
var addPositionPropertiesToSections = (sections, localizedDigits, isRtl) => {
  let position = 0;
  let positionInInput = isRtl ? 1 : 0;
  const newSections = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const renderedValue = getSectionVisibleValue(
      section,
      isRtl ? 'input-rtl' : 'input-ltr',
      localizedDigits
    );
    const sectionStr = `${section.startSeparator}${renderedValue}${section.endSeparator}`;
    const sectionLength = cleanString(sectionStr).length;
    const sectionLengthInInput = sectionStr.length;
    const cleanedValue = cleanString(renderedValue);
    const startInInput =
      positionInInput +
      (cleanedValue === '' ? 0 : renderedValue.indexOf(cleanedValue[0])) +
      section.startSeparator.length;
    const endInInput = startInInput + cleanedValue.length;
    newSections.push(
      _extends({}, section, {
        start: position,
        end: position + sectionLength,
        startInInput,
        endInInput,
      })
    );
    position += sectionLength;
    positionInInput += sectionLengthInInput;
  }
  return newSections;
};
var useFieldV6TextField = (params) => {
  const isRtl = useRtl();
  const focusTimeoutRef = React4.useRef(void 0);
  const selectionSyncTimeoutRef = React4.useRef(void 0);
  const {
    forwardedProps: {
      onFocus,
      onClick,
      onPaste,
      onBlur,
      inputRef: inputRefProp,
      placeholder: inPlaceholder,
    },
    internalProps: { readOnly = false, disabled = false },
    parsedSelectedSections,
    activeSectionIndex,
    state,
    fieldValueManager,
    valueManager,
    applyCharacterEditing,
    resetCharacterQuery,
    updateSectionValue,
    updateValueFromValueStr,
    clearActiveSection,
    clearValue,
    setTempAndroidValueStr,
    setSelectedSections,
    getSectionsFromValue,
    areAllSectionsEmpty,
    localizedDigits,
  } = params;
  const inputRef = React4.useRef(null);
  const handleRef = useForkRef(inputRefProp, inputRef);
  const sections = React4.useMemo(
    () => addPositionPropertiesToSections(state.sections, localizedDigits, isRtl),
    [state.sections, localizedDigits, isRtl]
  );
  const interactions = React4.useMemo(
    () => ({
      syncSelectionToDOM: () => {
        if (!inputRef.current) {
          return;
        }
        if (parsedSelectedSections == null) {
          if (inputRef.current.scrollLeft) {
            inputRef.current.scrollLeft = 0;
          }
          return;
        }
        if (inputRef.current !== getActiveElement(document)) {
          return;
        }
        const currentScrollTop = inputRef.current.scrollTop;
        if (parsedSelectedSections === 'all') {
          inputRef.current.select();
        } else {
          const selectedSection = sections[parsedSelectedSections];
          const selectionStart =
            selectedSection.type === 'empty'
              ? selectedSection.startInInput - selectedSection.startSeparator.length
              : selectedSection.startInInput;
          const selectionEnd =
            selectedSection.type === 'empty'
              ? selectedSection.endInInput + selectedSection.endSeparator.length
              : selectedSection.endInInput;
          if (
            selectionStart !== inputRef.current.selectionStart ||
            selectionEnd !== inputRef.current.selectionEnd
          ) {
            if (inputRef.current === getActiveElement(document)) {
              inputRef.current.setSelectionRange(selectionStart, selectionEnd);
            }
          }
          clearTimeout(selectionSyncTimeoutRef.current);
          selectionSyncTimeoutRef.current = setTimeout(() => {
            if (
              inputRef.current &&
              inputRef.current === getActiveElement(document) && // The section might loose all selection, where `selectionStart === selectionEnd`
              // https://github.com/mui/mui-x/pull/13652
              inputRef.current.selectionStart === inputRef.current.selectionEnd &&
              (inputRef.current.selectionStart !== selectionStart ||
                inputRef.current.selectionEnd !== selectionEnd)
            ) {
              interactions.syncSelectionToDOM();
            }
          });
        }
        inputRef.current.scrollTop = currentScrollTop;
      },
      getActiveSectionIndexFromDOM: () => {
        const browserStartIndex = inputRef.current.selectionStart ?? 0;
        const browserEndIndex = inputRef.current.selectionEnd ?? 0;
        if (browserStartIndex === 0 && browserEndIndex === 0) {
          return null;
        }
        const nextSectionIndex =
          browserStartIndex <= sections[0].startInInput
            ? 1
            : sections.findIndex(
                (section) =>
                  section.startInInput - section.startSeparator.length > browserStartIndex
              );
        return nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
      },
      focusField: (newSelectedSection = 0) => {
        var _a;
        if (getActiveElement(document) === inputRef.current) {
          return;
        }
        (_a = inputRef.current) == null ? void 0 : _a.focus();
        setSelectedSections(newSelectedSection);
      },
      setSelectedSections: (newSelectedSections) => setSelectedSections(newSelectedSections),
      isFieldFocused: () => inputRef.current === getActiveElement(document),
    }),
    [inputRef, parsedSelectedSections, sections, setSelectedSections]
  );
  const syncSelectionFromDOM = () => {
    const browserStartIndex = inputRef.current.selectionStart ?? 0;
    let nextSectionIndex;
    if (browserStartIndex <= sections[0].startInInput) {
      nextSectionIndex = 1;
    } else if (browserStartIndex >= sections[sections.length - 1].endInInput) {
      nextSectionIndex = 1;
    } else {
      nextSectionIndex = sections.findIndex(
        (section) => section.startInInput - section.startSeparator.length > browserStartIndex
      );
    }
    const sectionIndex = nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
    setSelectedSections(sectionIndex);
  };
  const handleInputFocus = useEventCallback_default((...args) => {
    onFocus == null ? void 0 : onFocus(...args);
    const input = inputRef.current;
    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      if (!input || input !== inputRef.current) {
        return;
      }
      if (activeSectionIndex != null) {
        return;
      }
      if (
        // avoid selecting all sections when focusing empty field without value
        input.value.length &&
        Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length
      ) {
        setSelectedSections('all');
      } else {
        syncSelectionFromDOM();
      }
    });
  });
  const handleInputClick = useEventCallback_default((event, ...args) => {
    if (event.isDefaultPrevented()) {
      return;
    }
    onClick == null ? void 0 : onClick(event, ...args);
    syncSelectionFromDOM();
  });
  const handleInputPaste = useEventCallback_default((event) => {
    onPaste == null ? void 0 : onPaste(event);
    event.preventDefault();
    if (readOnly || disabled) {
      return;
    }
    const pastedValue = event.clipboardData.getData('text');
    if (typeof parsedSelectedSections === 'number') {
      const activeSection = state.sections[parsedSelectedSections];
      const lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
      const digitsOnly = /^[0-9]+$/.test(pastedValue);
      const digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
      const isValidPastedValue =
        (activeSection.contentType === 'letter' && lettersOnly) ||
        (activeSection.contentType === 'digit' && digitsOnly) ||
        (activeSection.contentType === 'digit-with-letter' && digitsAndLetterOnly);
      if (isValidPastedValue) {
        resetCharacterQuery();
        updateSectionValue({
          activeSection,
          newSectionValue: pastedValue,
          shouldGoToNextSection: true,
        });
        return;
      }
      if (lettersOnly || digitsOnly) {
        return;
      }
    }
    resetCharacterQuery();
    updateValueFromValueStr(pastedValue);
  });
  const handleContainerBlur = useEventCallback_default((...args) => {
    onBlur == null ? void 0 : onBlur(...args);
    setSelectedSections(null);
  });
  const handleInputChange = useEventCallback_default((event) => {
    if (readOnly) {
      return;
    }
    const targetValue = event.target.value;
    if (targetValue === '') {
      resetCharacterQuery();
      clearValue();
      return;
    }
    const eventData = event.nativeEvent.data;
    const shouldUseEventData = eventData && eventData.length > 1;
    const valueStr2 = shouldUseEventData ? eventData : targetValue;
    const cleanValueStr = cleanString(valueStr2);
    if (parsedSelectedSections === 'all') {
      setSelectedSections(activeSectionIndex);
    }
    if (activeSectionIndex == null || shouldUseEventData) {
      updateValueFromValueStr(shouldUseEventData ? eventData : cleanValueStr);
      return;
    }
    let keyPressed;
    if (parsedSelectedSections === 'all' && cleanValueStr.length === 1) {
      keyPressed = cleanValueStr;
    } else {
      const prevValueStr = cleanString(
        fieldValueManager.getV6InputValueFromSections(sections, localizedDigits, isRtl)
      );
      let startOfDiffIndex = -1;
      let endOfDiffIndex = -1;
      for (let i = 0; i < prevValueStr.length; i += 1) {
        if (startOfDiffIndex === -1 && prevValueStr[i] !== cleanValueStr[i]) {
          startOfDiffIndex = i;
        }
        if (
          endOfDiffIndex === -1 &&
          prevValueStr[prevValueStr.length - i - 1] !== cleanValueStr[cleanValueStr.length - i - 1]
        ) {
          endOfDiffIndex = i;
        }
      }
      const activeSection = sections[activeSectionIndex];
      const hasDiffOutsideOfActiveSection =
        startOfDiffIndex < activeSection.start ||
        prevValueStr.length - endOfDiffIndex - 1 > activeSection.end;
      if (hasDiffOutsideOfActiveSection) {
        return;
      }
      const activeSectionEndRelativeToNewValue =
        cleanValueStr.length -
        prevValueStr.length +
        activeSection.end -
        cleanString(activeSection.endSeparator || '').length;
      keyPressed = cleanValueStr.slice(
        activeSection.start + cleanString(activeSection.startSeparator || '').length,
        activeSectionEndRelativeToNewValue
      );
    }
    if (keyPressed.length === 0) {
      if (isAndroid()) {
        setTempAndroidValueStr(valueStr2);
      }
      resetCharacterQuery();
      clearActiveSection();
      return;
    }
    applyCharacterEditing({
      keyPressed,
      sectionIndex: activeSectionIndex,
    });
  });
  const placeholder = React4.useMemo(() => {
    if (inPlaceholder !== void 0) {
      return inPlaceholder;
    }
    return fieldValueManager.getV6InputValueFromSections(
      getSectionsFromValue(valueManager.emptyValue),
      localizedDigits,
      isRtl
    );
  }, [
    inPlaceholder,
    fieldValueManager,
    getSectionsFromValue,
    valueManager.emptyValue,
    localizedDigits,
    isRtl,
  ]);
  const valueStr = React4.useMemo(
    () =>
      state.tempValueStrAndroid ??
      fieldValueManager.getV6InputValueFromSections(state.sections, localizedDigits, isRtl),
    [state.sections, fieldValueManager, state.tempValueStrAndroid, localizedDigits, isRtl]
  );
  React4.useEffect(() => {
    if (inputRef.current && inputRef.current === getActiveElement(document)) {
      setSelectedSections('all');
    }
    return () => {
      clearTimeout(focusTimeoutRef.current);
      clearTimeout(selectionSyncTimeoutRef.current);
    };
  }, []);
  const inputMode = React4.useMemo(() => {
    if (activeSectionIndex == null) {
      return 'text';
    }
    if (state.sections[activeSectionIndex].contentType === 'letter') {
      return 'text';
    }
    return 'numeric';
  }, [activeSectionIndex, state.sections]);
  const inputHasFocus = inputRef.current && inputRef.current === getActiveElement(document);
  const shouldShowPlaceholder = !inputHasFocus && areAllSectionsEmpty;
  return {
    interactions,
    returnedValue: {
      // Forwarded
      readOnly,
      onBlur: handleContainerBlur,
      onClick: handleInputClick,
      onFocus: handleInputFocus,
      onPaste: handleInputPaste,
      inputRef: handleRef,
      // Additional
      enableAccessibleFieldDOMStructure: false,
      placeholder,
      inputMode,
      autoComplete: 'off',
      value: shouldShowPlaceholder ? '' : valueStr,
      onChange: handleInputChange,
    },
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useField.js
var useField = (params) => {
  const utils = useUtils();
  const {
    internalProps,
    internalProps: {
      unstableFieldRef,
      minutesStep,
      enableAccessibleFieldDOMStructure = false,
      disabled = false,
      readOnly = false,
    },
    forwardedProps: { onKeyDown, error, clearable, onClear },
    fieldValueManager,
    valueManager,
    validator,
  } = params;
  const isRtl = useRtl();
  const stateResponse = useFieldState(params);
  const {
    state,
    activeSectionIndex,
    parsedSelectedSections,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    setTempAndroidValueStr,
    sectionsValueBoundaries,
    localizedDigits,
    timezone,
  } = stateResponse;
  const characterEditingResponse = useFieldCharacterEditing({
    sections: state.sections,
    updateSectionValue,
    sectionsValueBoundaries,
    localizedDigits,
    setTempAndroidValueStr,
    timezone,
  });
  const { resetCharacterQuery } = characterEditingResponse;
  const areAllSectionsEmpty = valueManager.areValuesEqual(
    utils,
    state.value,
    valueManager.emptyValue
  );
  const useFieldTextField = enableAccessibleFieldDOMStructure
    ? useFieldV7TextField
    : useFieldV6TextField;
  const sectionOrder = React5.useMemo(
    () => getSectionOrder(state.sections, isRtl && !enableAccessibleFieldDOMStructure),
    [state.sections, isRtl, enableAccessibleFieldDOMStructure]
  );
  const { returnedValue, interactions } = useFieldTextField(
    _extends({}, params, stateResponse, characterEditingResponse, {
      areAllSectionsEmpty,
      sectionOrder,
    })
  );
  const handleContainerKeyDown = useEventCallback_default((event) => {
    onKeyDown == null ? void 0 : onKeyDown(event);
    if (disabled) {
      return;
    }
    switch (true) {
      case (event.ctrlKey || event.metaKey) &&
        String.fromCharCode(event.keyCode) === 'A' &&
        !event.shiftKey &&
        !event.altKey: {
        event.preventDefault();
        setSelectedSections('all');
        break;
      }
      case event.key === 'ArrowRight': {
        event.preventDefault();
        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.startIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.endIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].rightIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }
      case event.key === 'ArrowLeft': {
        event.preventDefault();
        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.endIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.startIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].leftIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }
      case event.key === 'Delete': {
        event.preventDefault();
        if (readOnly) {
          break;
        }
        if (parsedSelectedSections == null || parsedSelectedSections === 'all') {
          clearValue();
        } else {
          clearActiveSection();
        }
        resetCharacterQuery();
        break;
      }
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();
        if (readOnly || activeSectionIndex == null) {
          break;
        }
        if (parsedSelectedSections === 'all') {
          setSelectedSections(activeSectionIndex);
        }
        const activeSection = state.sections[activeSectionIndex];
        const activeDateManager = fieldValueManager.getActiveDateManager(
          utils,
          state,
          activeSection
        );
        const newSectionValue = adjustSectionValue(
          utils,
          timezone,
          activeSection,
          event.key,
          sectionsValueBoundaries,
          localizedDigits,
          activeDateManager.date,
          {
            minutesStep,
          }
        );
        updateSectionValue({
          activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });
  useEnhancedEffect_default(() => {
    interactions.syncSelectionToDOM();
  });
  const { hasValidationError } = useValidation({
    props: internalProps,
    validator,
    timezone,
    value: state.value,
    onError: internalProps.onError,
  });
  const inputError = React5.useMemo(() => {
    if (error !== void 0) {
      return error;
    }
    return hasValidationError;
  }, [hasValidationError, error]);
  React5.useEffect(() => {
    if (!inputError && activeSectionIndex == null) {
      resetCharacterQuery();
    }
  }, [state.referenceValue, activeSectionIndex, inputError]);
  React5.useEffect(() => {
    if (state.tempValueStrAndroid != null && activeSectionIndex != null) {
      resetCharacterQuery();
      clearActiveSection();
    }
  }, [state.sections]);
  React5.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: interactions.getActiveSectionIndexFromDOM,
    setSelectedSections: interactions.setSelectedSections,
    focusField: interactions.focusField,
    isFieldFocused: interactions.isFieldFocused,
  }));
  const handleClearValue = useEventCallback_default((event, ...args) => {
    event.preventDefault();
    onClear == null ? void 0 : onClear(event, ...args);
    clearValue();
    if (!interactions.isFieldFocused()) {
      interactions.focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });
  const commonForwardedProps = {
    onKeyDown: handleContainerKeyDown,
    onClear: handleClearValue,
    error: inputError,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
  };
  const commonAdditionalProps = {
    disabled,
    readOnly,
  };
  return _extends(
    {},
    params.forwardedProps,
    commonForwardedProps,
    commonAdditionalProps,
    returnedValue
  );
};

// node_modules/@mui/x-date-pickers/hooks/useClearableField.js
var React6 = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ['clearable', 'onClear', 'InputProps', 'sx', 'slots', 'slotProps'];
var _excluded2 = ['ownerState'];
var useClearableField = (props) => {
  const translations = usePickersTranslations();
  const { clearable, onClear, InputProps, sx, slots, slotProps } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const IconButton = (slots == null ? void 0 : slots.clearButton) ?? IconButton_default;
  const _useSlotProps = useSlotProps_default({
      elementType: IconButton,
      externalSlotProps: slotProps == null ? void 0 : slotProps.clearButton,
      ownerState: {},
      className: 'clearButton',
      additionalProps: {
        title: translations.fieldClearLabel,
      },
    }),
    iconButtonProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded2);
  const EndClearIcon = (slots == null ? void 0 : slots.clearIcon) ?? ClearIcon;
  const endClearIconProps = useSlotProps_default({
    elementType: EndClearIcon,
    externalSlotProps: slotProps == null ? void 0 : slotProps.clearIcon,
    ownerState: {},
  });
  return _extends({}, other, {
    InputProps: _extends({}, InputProps, {
      endAdornment: (0, import_jsx_runtime.jsxs)(React6.Fragment, {
        children: [
          clearable &&
            (0, import_jsx_runtime.jsx)(InputAdornment_default, {
              position: 'end',
              sx: {
                marginRight: (InputProps == null ? void 0 : InputProps.endAdornment) ? -1 : -1.5,
              },
              children: (0, import_jsx_runtime.jsx)(
                IconButton,
                _extends({}, iconButtonProps, {
                  onClick: onClear,
                  children: (0, import_jsx_runtime.jsx)(
                    EndClearIcon,
                    _extends(
                      {
                        fontSize: 'small',
                      },
                      endClearIconProps
                    )
                  ),
                })
              ),
            }),
          InputProps == null ? void 0 : InputProps.endAdornment,
        ],
      }),
    }),
    sx: [
      {
        '& .clearButton': {
          opacity: 1,
        },
        '@media (pointer: fine)': {
          '& .clearButton': {
            opacity: 0,
          },
          '&:hover, &:focus-within': {
            '.clearButton': {
              opacity: 1,
            },
          },
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
  });
};

// node_modules/@mui/x-date-pickers/hooks/useSplitFieldProps.js
var React7 = __toESM(require_react());
var SHARED_FIELD_INTERNAL_PROP_NAMES = [
  'value',
  'defaultValue',
  'referenceDate',
  'format',
  'formatDensity',
  'onChange',
  'timezone',
  'onError',
  'shouldRespectLeadingZeros',
  'selectedSections',
  'onSelectedSectionsChange',
  'unstableFieldRef',
  'enableAccessibleFieldDOMStructure',
  'disabled',
  'readOnly',
  'dateSeparator',
];
var useSplitFieldProps = (props, valueType) => {
  return React7.useMemo(() => {
    const forwardedProps = _extends({}, props);
    const internalProps = {};
    const extractProp = (propName) => {
      if (forwardedProps.hasOwnProperty(propName)) {
        internalProps[propName] = forwardedProps[propName];
        delete forwardedProps[propName];
      }
    };
    SHARED_FIELD_INTERNAL_PROP_NAMES.forEach(extractProp);
    if (valueType === 'date') {
      DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
    } else if (valueType === 'time') {
      TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
    } else if (valueType === 'date-time') {
      DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
      TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
      DATE_TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
    }
    return {
      forwardedProps,
      internalProps,
    };
  }, [props, valueType]);
};

// node_modules/@mui/x-date-pickers/hooks/useParsedFormat.js
var React8 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/hooks/usePickersContext.js
var React10 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/components/PickersProvider.js
var React9 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var PickersContext = React9.createContext(null);
function PickersProvider(props) {
  const { contextValue, localeText, children } = props;
  return (0, import_jsx_runtime2.jsx)(PickersContext.Provider, {
    value: contextValue,
    children: (0, import_jsx_runtime2.jsx)(LocalizationProvider, {
      localeText,
      children,
    }),
  });
}

// node_modules/@mui/x-date-pickers/internals/hooks/defaultizedFieldProps.js
var useDefaultizedDateField = (props) => {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  return _extends({}, props, {
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  });
};

// node_modules/@mui/x-date-pickers/DateField/useDateField.js
var useDateField = (inProps) => {
  const props = useDefaultizedDateField(inProps);
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  return useField({
    forwardedProps,
    internalProps,
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateDate,
    valueType: 'date',
  });
};

// node_modules/@mui/x-date-pickers/PickersTextField/PickersTextField.js
var React17 = __toESM(require_react());
var import_prop_types6 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersTextField/pickersTextFieldClasses.js
function getPickersTextFieldUtilityClass(slot) {
  return generateUtilityClass('MuiPickersTextField', slot);
}
var pickersTextFieldClasses = generateUtilityClasses('MuiPickersTextField', [
  'root',
  'focused',
  'disabled',
  'error',
  'required',
]);

// node_modules/@mui/x-date-pickers/PickersTextField/PickersOutlinedInput/PickersOutlinedInput.js
var React14 = __toESM(require_react());
var import_prop_types3 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInputBase/PickersInputBase.js
var React12 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInputBase/pickersInputBaseClasses.js
function getPickersInputBaseUtilityClass(slot) {
  return generateUtilityClass('MuiPickersInputBase', slot);
}
var pickersInputBaseClasses = generateUtilityClasses('MuiPickersInputBase', [
  'root',
  'focused',
  'disabled',
  'error',
  'notchedOutline',
  'sectionContent',
  'sectionBefore',
  'sectionAfter',
  'adornedStart',
  'adornedEnd',
  'input',
]);

// node_modules/@mui/x-date-pickers/PickersSectionList/PickersSectionList.js
var React11 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersSectionList/pickersSectionListClasses.js
function getPickersSectionListUtilityClass(slot) {
  return generateUtilityClass('MuiPickersSectionList', slot);
}
var pickersSectionListClasses = generateUtilityClasses('MuiPickersSectionList', [
  'root',
  'section',
  'sectionContent',
]);

// node_modules/@mui/x-date-pickers/PickersSectionList/PickersSectionList.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var _excluded3 = ['slots', 'slotProps', 'elements', 'sectionListRef'];
var PickersSectionListRoot = styled_default('div', {
  name: 'MuiPickersSectionList',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  direction: 'ltr /*! @noflip */',
  outline: 'none',
});
var PickersSectionListSection = styled_default('span', {
  name: 'MuiPickersSectionList',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})({});
var PickersSectionListSectionSeparator = styled_default('span', {
  name: 'MuiPickersSectionList',
  slot: 'SectionSeparator',
  overridesResolver: (props, styles) => styles.sectionSeparator,
})({
  whiteSpace: 'pre',
});
var PickersSectionListSectionContent = styled_default('span', {
  name: 'MuiPickersSectionList',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.sectionContent,
})({
  outline: 'none',
});
var useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    section: ['section'],
    sectionContent: ['sectionContent'],
  };
  return composeClasses(slots, getPickersSectionListUtilityClass, classes);
};
function PickersSection(props) {
  const { slots, slotProps, element, classes } = props;
  const Section = (slots == null ? void 0 : slots.section) ?? PickersSectionListSection;
  const sectionProps = useSlotProps_default({
    elementType: Section,
    externalSlotProps: slotProps == null ? void 0 : slotProps.section,
    externalForwardedProps: element.container,
    className: classes.section,
    ownerState: {},
  });
  const SectionContent =
    (slots == null ? void 0 : slots.sectionContent) ?? PickersSectionListSectionContent;
  const sectionContentProps = useSlotProps_default({
    elementType: SectionContent,
    externalSlotProps: slotProps == null ? void 0 : slotProps.sectionContent,
    externalForwardedProps: element.content,
    additionalProps: {
      suppressContentEditableWarning: true,
    },
    className: classes.sectionContent,
    ownerState: {},
  });
  const SectionSeparator =
    (slots == null ? void 0 : slots.sectionSeparator) ?? PickersSectionListSectionSeparator;
  const sectionSeparatorBeforeProps = useSlotProps_default({
    elementType: SectionSeparator,
    externalSlotProps: slotProps == null ? void 0 : slotProps.sectionSeparator,
    externalForwardedProps: element.before,
    ownerState: {
      position: 'before',
    },
  });
  const sectionSeparatorAfterProps = useSlotProps_default({
    elementType: SectionSeparator,
    externalSlotProps: slotProps == null ? void 0 : slotProps.sectionSeparator,
    externalForwardedProps: element.after,
    ownerState: {
      position: 'after',
    },
  });
  return (0, import_jsx_runtime3.jsxs)(
    Section,
    _extends({}, sectionProps, {
      children: [
        (0, import_jsx_runtime3.jsx)(SectionSeparator, _extends({}, sectionSeparatorBeforeProps)),
        (0, import_jsx_runtime3.jsx)(SectionContent, _extends({}, sectionContentProps)),
        (0, import_jsx_runtime3.jsx)(SectionSeparator, _extends({}, sectionSeparatorAfterProps)),
      ],
    })
  );
}
true
  ? (PickersSection.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      classes: import_prop_types.default.object.isRequired,
      element: import_prop_types.default.shape({
        after: import_prop_types.default.object.isRequired,
        before: import_prop_types.default.object.isRequired,
        container: import_prop_types.default.object.isRequired,
        content: import_prop_types.default.object.isRequired,
      }).isRequired,
      /**
       * The props used for each component slot.
       */
      slotProps: import_prop_types.default.object,
      /**
       * Overridable component slots.
       */
      slots: import_prop_types.default.object,
    })
  : void 0;
var PickersSectionList = React11.forwardRef(function PickersSectionList2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersSectionList',
  });
  const { slots, slotProps, elements, sectionListRef } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded3);
  const classes = useUtilityClasses(props);
  const rootRef = React11.useRef(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const getRoot = (methodName) => {
    if (!rootRef.current) {
      throw new Error(
        `MUI X: Cannot call sectionListRef.${methodName} before the mount of the component.`
      );
    }
    return rootRef.current;
  };
  React11.useImperativeHandle(sectionListRef, () => ({
    getRoot() {
      return getRoot('getRoot');
    },
    getSectionContainer(index) {
      const root = getRoot('getSectionContainer');
      return root.querySelector(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"]`
      );
    },
    getSectionContent(index) {
      const root = getRoot('getSectionContent');
      return root.querySelector(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"] .${pickersSectionListClasses.sectionContent}`
      );
    },
    getSectionIndexFromDOMElement(element) {
      const root = getRoot('getSectionIndexFromDOMElement');
      if (element == null || !root.contains(element)) {
        return null;
      }
      let sectionContainer = null;
      if (element.classList.contains(pickersSectionListClasses.section)) {
        sectionContainer = element;
      } else if (element.classList.contains(pickersSectionListClasses.sectionContent)) {
        sectionContainer = element.parentElement;
      }
      if (sectionContainer == null) {
        return null;
      }
      return Number(sectionContainer.dataset.sectionindex);
    },
  }));
  const Root = (slots == null ? void 0 : slots.root) ?? PickersSectionListRoot;
  const rootProps = useSlotProps_default({
    elementType: Root,
    externalSlotProps: slotProps == null ? void 0 : slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: handleRootRef,
      suppressContentEditableWarning: true,
    },
    className: classes.root,
    ownerState: {},
  });
  return (0, import_jsx_runtime3.jsx)(
    Root,
    _extends({}, rootProps, {
      children: rootProps.contentEditable
        ? elements
            .map(
              ({ content, before, after }) =>
                `${before.children}${content.children}${after.children}`
            )
            .join('')
        : (0, import_jsx_runtime3.jsx)(React11.Fragment, {
            children: elements.map((element, elementIndex) =>
              (0, import_jsx_runtime3.jsx)(
                PickersSection,
                {
                  slots,
                  slotProps,
                  element,
                  classes,
                },
                elementIndex
              )
            ),
          }),
    })
  );
});
true
  ? (PickersSectionList.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types.default.object,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types.default.bool.isRequired,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types.default.arrayOf(
        import_prop_types.default.shape({
          after: import_prop_types.default.object.isRequired,
          before: import_prop_types.default.object.isRequired,
          container: import_prop_types.default.object.isRequired,
          content: import_prop_types.default.object.isRequired,
        })
      ).isRequired,
      sectionListRef: import_prop_types.default.oneOfType([
        import_prop_types.default.func,
        import_prop_types.default.shape({
          current: import_prop_types.default.shape({
            getRoot: import_prop_types.default.func.isRequired,
            getSectionContainer: import_prop_types.default.func.isRequired,
            getSectionContent: import_prop_types.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The props used for each component slot.
       */
      slotProps: import_prop_types.default.object,
      /**
       * Overridable component slots.
       */
      slots: import_prop_types.default.object,
    })
  : void 0;

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInputBase/PickersInputBase.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var _excluded4 = [
  'elements',
  'areAllSectionsEmpty',
  'defaultValue',
  'label',
  'value',
  'onChange',
  'id',
  'autoFocus',
  'endAdornment',
  'startAdornment',
  'renderSuffix',
  'slots',
  'slotProps',
  'contentEditable',
  'tabIndex',
  'onInput',
  'onPaste',
  'onKeyDown',
  'fullWidth',
  'name',
  'readOnly',
  'inputProps',
  'inputRef',
  'sectionListRef',
];
var round = (value) => Math.round(value * 1e5) / 1e5;
var PickersInputBaseRoot = styled_default('div', {
  name: 'MuiPickersInputBase',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) =>
  _extends({}, theme.typography.body1, {
    color: (theme.vars || theme).palette.text.primary,
    cursor: 'text',
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    // Prevent padding issue with fullWidth.
    letterSpacing: `${round(0.15 / 16)}em`,
    variants: [
      {
        props: {
          fullWidth: true,
        },
        style: {
          width: '100%',
        },
      },
    ],
  })
);
var PickersInputBaseSectionsContainer = styled_default(PickersSectionListRoot, {
  name: 'MuiPickersInputBase',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})(({ theme }) => ({
  padding: '4px 0 5px',
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em',
  // 23px
  flexGrow: 1,
  outline: 'none',
  display: 'flex',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  letterSpacing: 'inherit',
  // Baseline behavior
  width: '182px',
  variants: [
    {
      props: {
        isRtl: true,
      },
      style: {
        textAlign: 'right /*! @noflip */',
      },
    },
    {
      props: {
        size: 'small',
      },
      style: {
        paddingTop: 1,
      },
    },
    {
      props: {
        adornedStart: false,
        focused: false,
        filled: false,
      },
      style: {
        color: 'currentColor',
        opacity: 0,
      },
    },
    {
      // Can't use the object notation because label can be null or undefined
      props: ({ adornedStart, focused, filled, label }) =>
        !adornedStart && !focused && !filled && label == null,
      style: theme.vars
        ? {
            opacity: theme.vars.opacity.inputPlaceholder,
          }
        : {
            opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
          },
    },
  ],
}));
var PickersInputBaseSection = styled_default(PickersSectionListSection, {
  name: 'MuiPickersInputBase',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  letterSpacing: 'inherit',
  lineHeight: '1.4375em',
  // 23px
  display: 'inline-block',
  whiteSpace: 'nowrap',
}));
var PickersInputBaseSectionContent = styled_default(PickersSectionListSectionContent, {
  name: 'MuiPickersInputBase',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em',
  // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
  outline: 'none',
}));
var PickersInputBaseSectionSeparator = styled_default(PickersSectionListSectionSeparator, {
  name: 'MuiPickersInputBase',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
  letterSpacing: 'inherit',
}));
var PickersInputBaseInput = styled_default('input', {
  name: 'MuiPickersInputBase',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.hiddenInput,
})(_extends({}, visuallyHidden_default));
var useUtilityClasses2 = (ownerState) => {
  const {
    focused,
    disabled,
    error,
    classes,
    fullWidth,
    readOnly,
    color,
    size,
    endAdornment,
    startAdornment,
  } = ownerState;
  const slots = {
    root: [
      'root',
      focused && !disabled && 'focused',
      disabled && 'disabled',
      readOnly && 'readOnly',
      error && 'error',
      fullWidth && 'fullWidth',
      `color${capitalize(color)}`,
      size === 'small' && 'inputSizeSmall',
      Boolean(startAdornment) && 'adornedStart',
      Boolean(endAdornment) && 'adornedEnd',
    ],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
    sectionsContainer: ['sectionsContainer'],
    sectionContent: ['sectionContent'],
    sectionBefore: ['sectionBefore'],
    sectionAfter: ['sectionAfter'],
  };
  return composeClasses(slots, getPickersInputBaseUtilityClass, classes);
};
var PickersInputBase = React12.forwardRef(function PickersInputBase2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersInputBase',
  });
  const {
      elements,
      areAllSectionsEmpty,
      value,
      onChange,
      id,
      endAdornment,
      startAdornment,
      renderSuffix,
      slots,
      slotProps,
      contentEditable,
      tabIndex,
      onInput,
      onPaste,
      onKeyDown,
      name,
      readOnly,
      inputProps,
      inputRef,
      sectionListRef,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded4);
  const rootRef = React12.useRef(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const handleInputRef = useForkRef(inputProps == null ? void 0 : inputProps.ref, inputRef);
  const isRtl = useRtl();
  const muiFormControl = useFormControl();
  if (!muiFormControl) {
    throw new Error(
      'MUI X: PickersInputBase should always be used inside a PickersTextField component'
    );
  }
  const handleInputFocus = (event) => {
    var _a;
    if (muiFormControl.disabled) {
      event.stopPropagation();
      return;
    }
    (_a = muiFormControl.onFocus) == null ? void 0 : _a.call(muiFormControl, event);
  };
  React12.useEffect(() => {
    if (muiFormControl) {
      muiFormControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [muiFormControl, startAdornment]);
  React12.useEffect(() => {
    if (!muiFormControl) {
      return;
    }
    if (areAllSectionsEmpty) {
      muiFormControl.onEmpty();
    } else {
      muiFormControl.onFilled();
    }
  }, [muiFormControl, areAllSectionsEmpty]);
  const ownerState = _extends({}, props, muiFormControl, {
    isRtl,
  });
  const classes = useUtilityClasses2(ownerState);
  const InputRoot = (slots == null ? void 0 : slots.root) || PickersInputBaseRoot;
  const inputRootProps = useSlotProps_default({
    elementType: InputRoot,
    externalSlotProps: slotProps == null ? void 0 : slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      'aria-invalid': muiFormControl.error,
      ref: handleRootRef,
    },
    className: classes.root,
    ownerState,
  });
  const InputSectionsContainer =
    (slots == null ? void 0 : slots.input) || PickersInputBaseSectionsContainer;
  return (0, import_jsx_runtime4.jsxs)(
    InputRoot,
    _extends({}, inputRootProps, {
      children: [
        startAdornment,
        (0, import_jsx_runtime4.jsx)(PickersSectionList, {
          sectionListRef,
          elements,
          contentEditable,
          tabIndex,
          className: classes.sectionsContainer,
          onFocus: handleInputFocus,
          onBlur: muiFormControl.onBlur,
          onInput,
          onPaste,
          onKeyDown,
          slots: {
            root: InputSectionsContainer,
            section: PickersInputBaseSection,
            sectionContent: PickersInputBaseSectionContent,
            sectionSeparator: PickersInputBaseSectionSeparator,
          },
          slotProps: {
            root: {
              ownerState,
            },
            sectionContent: {
              className: pickersInputBaseClasses.sectionContent,
            },
            sectionSeparator: ({ position }) => ({
              className:
                position === 'before'
                  ? pickersInputBaseClasses.sectionBefore
                  : pickersInputBaseClasses.sectionAfter,
            }),
          },
        }),
        endAdornment,
        renderSuffix ? renderSuffix(_extends({}, muiFormControl)) : null,
        (0, import_jsx_runtime4.jsx)(
          PickersInputBaseInput,
          _extends(
            {
              name,
              className: classes.input,
              value,
              onChange,
              id,
              'aria-hidden': 'true',
              tabIndex: -1,
              readOnly,
              required: muiFormControl.required,
              disabled: muiFormControl.disabled,
            },
            inputProps,
            {
              ref: handleInputRef,
            }
          )
        ),
      ],
    })
  );
});
true
  ? (PickersInputBase.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Is `true` if the current values equals the empty value.
       * For a single item value, it means that `value === null`
       * For a range value, it means that `value === [null, null]`
       */
      areAllSectionsEmpty: import_prop_types2.default.bool.isRequired,
      className: import_prop_types2.default.string,
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: import_prop_types2.default.elementType,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types2.default.bool.isRequired,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types2.default.arrayOf(
        import_prop_types2.default.shape({
          after: import_prop_types2.default.object.isRequired,
          before: import_prop_types2.default.object.isRequired,
          container: import_prop_types2.default.object.isRequired,
          content: import_prop_types2.default.object.isRequired,
        })
      ).isRequired,
      endAdornment: import_prop_types2.default.node,
      fullWidth: import_prop_types2.default.bool,
      id: import_prop_types2.default.string,
      inputProps: import_prop_types2.default.object,
      inputRef: refType_default,
      label: import_prop_types2.default.node,
      margin: import_prop_types2.default.oneOf(['dense', 'none', 'normal']),
      name: import_prop_types2.default.string,
      onChange: import_prop_types2.default.func.isRequired,
      onClick: import_prop_types2.default.func.isRequired,
      onInput: import_prop_types2.default.func.isRequired,
      onKeyDown: import_prop_types2.default.func.isRequired,
      onPaste: import_prop_types2.default.func.isRequired,
      ownerState: import_prop_types2.default.any,
      readOnly: import_prop_types2.default.bool,
      renderSuffix: import_prop_types2.default.func,
      sectionListRef: import_prop_types2.default.oneOfType([
        import_prop_types2.default.func,
        import_prop_types2.default.shape({
          current: import_prop_types2.default.shape({
            getRoot: import_prop_types2.default.func.isRequired,
            getSectionContainer: import_prop_types2.default.func.isRequired,
            getSectionContent: import_prop_types2.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types2.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types2.default.object,
      /**
       * The components used for each slot inside.
       *
       * @default {}
       */
      slots: import_prop_types2.default.object,
      startAdornment: import_prop_types2.default.node,
      style: import_prop_types2.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types2.default.oneOfType([
        import_prop_types2.default.arrayOf(
          import_prop_types2.default.oneOfType([
            import_prop_types2.default.func,
            import_prop_types2.default.object,
            import_prop_types2.default.bool,
          ])
        ),
        import_prop_types2.default.func,
        import_prop_types2.default.object,
      ]),
      value: import_prop_types2.default.string.isRequired,
    })
  : void 0;

// node_modules/@mui/x-date-pickers/PickersTextField/PickersOutlinedInput/pickersOutlinedInputClasses.js
function getPickersOutlinedInputUtilityClass(slot) {
  return generateUtilityClass('MuiPickersOutlinedInput', slot);
}
var pickersOutlinedInputClasses = _extends(
  {},
  pickersInputBaseClasses,
  generateUtilityClasses('MuiPickersOutlinedInput', ['root', 'notchedOutline', 'input'])
);

// node_modules/@mui/x-date-pickers/PickersTextField/PickersOutlinedInput/Outline.js
var React13 = __toESM(require_react());
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var _excluded5 = ['children', 'className', 'label', 'notched', 'shrink'];
var OutlineRoot = styled_default('fieldset', {
  name: 'MuiPickersOutlinedInput',
  slot: 'NotchedOutline',
  overridesResolver: (props, styles) => styles.notchedOutline,
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    textAlign: 'left',
    position: 'absolute',
    bottom: 0,
    right: 0,
    top: -5,
    left: 0,
    margin: 0,
    padding: '0 8px',
    pointerEvents: 'none',
    borderRadius: 'inherit',
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    minWidth: '0%',
    borderColor: theme.vars
      ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
      : borderColor,
  };
});
var OutlineLabel = styled_default('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
}));
var OutlineLegend = styled_default('legend')(({ theme }) => ({
  float: 'unset',
  // Fix conflict with bootstrap
  width: 'auto',
  // Fix conflict with bootstrap
  overflow: 'hidden',
  // Fix Horizontal scroll when label too long
  variants: [
    {
      props: {
        withLabel: false,
      },
      style: {
        padding: 0,
        lineHeight: '11px',
        // sync with `height` in `legend` styles
        transition: theme.transitions.create('width', {
          duration: 150,
          easing: theme.transitions.easing.easeOut,
        }),
      },
    },
    {
      props: {
        withLabel: true,
      },
      style: {
        display: 'block',
        // Fix conflict with normalize.css and sanitize.css
        padding: 0,
        height: 11,
        // sync with `lineHeight` in `legend` styles
        fontSize: '0.75em',
        visibility: 'hidden',
        maxWidth: 0.01,
        transition: theme.transitions.create('max-width', {
          duration: 50,
          easing: theme.transitions.easing.easeOut,
        }),
        whiteSpace: 'nowrap',
        '& > span': {
          paddingLeft: 5,
          paddingRight: 5,
          display: 'inline-block',
          opacity: 0,
          visibility: 'visible',
        },
      },
    },
    {
      props: {
        withLabel: true,
        notched: true,
      },
      style: {
        maxWidth: '100%',
        transition: theme.transitions.create('max-width', {
          duration: 100,
          easing: theme.transitions.easing.easeOut,
          delay: 50,
        }),
      },
    },
  ],
}));
function Outline(props) {
  const { className, label } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded5);
  const withLabel = label != null && label !== '';
  const ownerState = _extends({}, props, {
    withLabel,
  });
  return (0, import_jsx_runtime5.jsx)(
    OutlineRoot,
    _extends(
      {
        'aria-hidden': true,
        className,
      },
      other,
      {
        ownerState,
        children: (0, import_jsx_runtime5.jsx)(OutlineLegend, {
          ownerState,
          children: withLabel
            ? (0, import_jsx_runtime5.jsx)(OutlineLabel, {
                children: label,
              })
            : // notranslate needed while Google Translate will not fix zero-width space issue
              (0, import_jsx_runtime5.jsx)(OutlineLabel, {
                className: 'notranslate',
                children: '​',
              }),
        }),
      }
    )
  );
}

// node_modules/@mui/x-date-pickers/PickersTextField/PickersOutlinedInput/PickersOutlinedInput.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var _excluded6 = ['label', 'autoFocus', 'ownerState', 'notched'];
var PickersOutlinedInputRoot = styled_default(PickersInputBaseRoot, {
  name: 'MuiPickersOutlinedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    padding: '0 14px',
    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${pickersOutlinedInputClasses.focused} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderWidth: 2,
    },
    [`&.${pickersOutlinedInputClasses.disabled}`]: {
      [`& .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },
      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },
    [`&.${pickersOutlinedInputClasses.error} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.error.main,
    },
    variants: Object.keys((theme.vars ?? theme).palette)
      .filter((key) => {
        var _a;
        return ((_a = (theme.vars ?? theme).palette[key]) == null ? void 0 : _a.main) ?? false;
      })
      .map((color) => ({
        props: {
          color,
        },
        style: {
          [`&.${pickersOutlinedInputClasses.focused}:not(.${pickersOutlinedInputClasses.error}) .${pickersOutlinedInputClasses.notchedOutline}`]:
            {
              // @ts-ignore
              borderColor: (theme.vars || theme).palette[color].main,
            },
        },
      })),
  };
});
var PickersOutlinedInputSectionsContainer = styled_default(PickersInputBaseSectionsContainer, {
  name: 'MuiPickersOutlinedInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})({
  padding: '16.5px 0',
  variants: [
    {
      props: {
        size: 'small',
      },
      style: {
        padding: '8.5px 0',
      },
    },
  ],
});
var useUtilityClasses3 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
  };
  const composedClasses = composeClasses(slots, getPickersOutlinedInputUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
var PickersOutlinedInput = React14.forwardRef(function PickersOutlinedInput2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersOutlinedInput',
  });
  const { label, ownerState: ownerStateProp, notched } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded6);
  const muiFormControl = useFormControl();
  const ownerState = _extends({}, props, ownerStateProp, muiFormControl, {
    color: (muiFormControl == null ? void 0 : muiFormControl.color) || 'primary',
  });
  const classes = useUtilityClasses3(ownerState);
  return (0, import_jsx_runtime6.jsx)(
    PickersInputBase,
    _extends(
      {
        slots: {
          root: PickersOutlinedInputRoot,
          input: PickersOutlinedInputSectionsContainer,
        },
        renderSuffix: (state) =>
          (0, import_jsx_runtime6.jsx)(Outline, {
            shrink: Boolean(notched || state.adornedStart || state.focused || state.filled),
            notched: Boolean(notched || state.adornedStart || state.focused || state.filled),
            className: classes.notchedOutline,
            label:
              label != null &&
              label !== '' &&
              (muiFormControl == null ? void 0 : muiFormControl.required)
                ? (0, import_jsx_runtime6.jsxs)(React14.Fragment, {
                    children: [label, ' ', '*'],
                  })
                : label,
            ownerState,
          }),
      },
      other,
      {
        label,
        classes,
        ref,
      }
    )
  );
});
true
  ? (PickersOutlinedInput.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Is `true` if the current values equals the empty value.
       * For a single item value, it means that `value === null`
       * For a range value, it means that `value === [null, null]`
       */
      areAllSectionsEmpty: import_prop_types3.default.bool.isRequired,
      className: import_prop_types3.default.string,
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: import_prop_types3.default.elementType,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types3.default.bool.isRequired,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types3.default.arrayOf(
        import_prop_types3.default.shape({
          after: import_prop_types3.default.object.isRequired,
          before: import_prop_types3.default.object.isRequired,
          container: import_prop_types3.default.object.isRequired,
          content: import_prop_types3.default.object.isRequired,
        })
      ).isRequired,
      endAdornment: import_prop_types3.default.node,
      fullWidth: import_prop_types3.default.bool,
      id: import_prop_types3.default.string,
      inputProps: import_prop_types3.default.object,
      inputRef: refType_default,
      label: import_prop_types3.default.node,
      margin: import_prop_types3.default.oneOf(['dense', 'none', 'normal']),
      name: import_prop_types3.default.string,
      notched: import_prop_types3.default.bool,
      onChange: import_prop_types3.default.func.isRequired,
      onClick: import_prop_types3.default.func.isRequired,
      onInput: import_prop_types3.default.func.isRequired,
      onKeyDown: import_prop_types3.default.func.isRequired,
      onPaste: import_prop_types3.default.func.isRequired,
      ownerState: import_prop_types3.default.any,
      readOnly: import_prop_types3.default.bool,
      renderSuffix: import_prop_types3.default.func,
      sectionListRef: import_prop_types3.default.oneOfType([
        import_prop_types3.default.func,
        import_prop_types3.default.shape({
          current: import_prop_types3.default.shape({
            getRoot: import_prop_types3.default.func.isRequired,
            getSectionContainer: import_prop_types3.default.func.isRequired,
            getSectionContent: import_prop_types3.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types3.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types3.default.object,
      /**
       * The components used for each slot inside.
       *
       * @default {}
       */
      slots: import_prop_types3.default.object,
      startAdornment: import_prop_types3.default.node,
      style: import_prop_types3.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types3.default.oneOfType([
        import_prop_types3.default.arrayOf(
          import_prop_types3.default.oneOfType([
            import_prop_types3.default.func,
            import_prop_types3.default.object,
            import_prop_types3.default.bool,
          ])
        ),
        import_prop_types3.default.func,
        import_prop_types3.default.object,
      ]),
      value: import_prop_types3.default.string.isRequired,
    })
  : void 0;
PickersOutlinedInput.muiName = 'Input';

// node_modules/@mui/x-date-pickers/PickersTextField/PickersFilledInput/PickersFilledInput.js
var React15 = __toESM(require_react());
var import_prop_types4 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersTextField/PickersFilledInput/pickersFilledInputClasses.js
function getPickersFilledInputUtilityClass(slot) {
  return generateUtilityClass('MuiPickersFilledInput', slot);
}
var pickersFilledInputClasses = _extends(
  {},
  pickersInputBaseClasses,
  generateUtilityClasses('MuiPickersFilledInput', ['root', 'underline', 'input'])
);

// node_modules/@mui/x-date-pickers/PickersTextField/PickersFilledInput/PickersFilledInput.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var _excluded7 = ['label', 'autoFocus', 'disableUnderline', 'ownerState'];
var PickersFilledInputRoot = styled_default(PickersInputBaseRoot, {
  name: 'MuiPickersFilledInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'disableUnderline',
})(({ theme }) => {
  const light = theme.palette.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  const backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
  const hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
  const disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
  return {
    backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    '&:hover': {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
      },
    },
    [`&.${pickersFilledInputClasses.focused}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    },
    [`&.${pickersFilledInputClasses.disabled}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground,
    },
    variants: [
      ...Object.keys((theme.vars ?? theme).palette)
        .filter((key) => (theme.vars ?? theme).palette[key].main)
        .map((color) => {
          var _a;
          return {
            props: {
              color,
              disableUnderline: false,
            },
            style: {
              '&::after': {
                // @ts-ignore
                borderBottom: `2px solid ${(_a = (theme.vars || theme).palette[color]) == null ? void 0 : _a.main}`,
              },
            },
          };
        }),
      {
        props: {
          disableUnderline: false,
        },
        style: {
          '&::after': {
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '""',
            position: 'absolute',
            right: 0,
            transform: 'scaleX(0)',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeOut,
            }),
            pointerEvents: 'none',
            // Transparent to the hover style.
          },
          [`&.${pickersFilledInputClasses.focused}:after`]: {
            // translateX(0) is a workaround for Safari transform scale bug
            // See https://github.com/mui/material-ui/issues/31766
            transform: 'scaleX(1) translateX(0)',
          },
          [`&.${pickersFilledInputClasses.error}`]: {
            '&:before, &:after': {
              borderBottomColor: (theme.vars || theme).palette.error.main,
            },
          },
          '&::before': {
            borderBottom: `1px solid ${theme.vars ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})` : bottomLineColor}`,
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '"\\00a0"',
            position: 'absolute',
            right: 0,
            transition: theme.transitions.create('border-bottom-color', {
              duration: theme.transitions.duration.shorter,
            }),
            pointerEvents: 'none',
            // Transparent to the hover style.
          },
          [`&:hover:not(.${pickersFilledInputClasses.disabled}, .${pickersFilledInputClasses.error}):before`]:
            {
              borderBottom: `1px solid ${(theme.vars || theme).palette.text.primary}`,
            },
          [`&.${pickersFilledInputClasses.disabled}:before`]: {
            borderBottomStyle: 'dotted',
          },
        },
      },
      {
        props: ({ startAdornment }) => !!startAdornment,
        style: {
          paddingLeft: 12,
        },
      },
      {
        props: ({ endAdornment }) => !!endAdornment,
        style: {
          paddingRight: 12,
        },
      },
    ],
  };
});
var PickersFilledSectionsContainer = styled_default(PickersInputBaseSectionsContainer, {
  name: 'MuiPickersFilledInput',
  slot: 'sectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  variants: [
    {
      props: {
        size: 'small',
      },
      style: {
        paddingTop: 21,
        paddingBottom: 4,
      },
    },
    {
      props: ({ startAdornment }) => !!startAdornment,
      style: {
        paddingLeft: 0,
      },
    },
    {
      props: ({ endAdornment }) => !!endAdornment,
      style: {
        paddingRight: 0,
      },
    },
    {
      props: {
        hiddenLabel: true,
      },
      style: {
        paddingTop: 16,
        paddingBottom: 17,
      },
    },
    {
      props: {
        hiddenLabel: true,
        size: 'small',
      },
      style: {
        paddingTop: 8,
        paddingBottom: 9,
      },
    },
  ],
});
var useUtilityClasses4 = (ownerState) => {
  const { classes, disableUnderline } = ownerState;
  const slots = {
    root: ['root', !disableUnderline && 'underline'],
    input: ['input'],
  };
  const composedClasses = composeClasses(slots, getPickersFilledInputUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
var PickersFilledInput = React15.forwardRef(function PickersFilledInput2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersFilledInput',
  });
  const { label, disableUnderline = false, ownerState: ownerStateProp } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded7);
  const muiFormControl = useFormControl();
  const ownerState = _extends({}, props, ownerStateProp, muiFormControl, {
    color: (muiFormControl == null ? void 0 : muiFormControl.color) || 'primary',
  });
  const classes = useUtilityClasses4(ownerState);
  return (0, import_jsx_runtime7.jsx)(
    PickersInputBase,
    _extends(
      {
        slots: {
          root: PickersFilledInputRoot,
          input: PickersFilledSectionsContainer,
        },
        slotProps: {
          root: {
            disableUnderline,
          },
        },
      },
      other,
      {
        label,
        classes,
        ref,
      }
    )
  );
});
true
  ? (PickersFilledInput.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Is `true` if the current values equals the empty value.
       * For a single item value, it means that `value === null`
       * For a range value, it means that `value === [null, null]`
       */
      areAllSectionsEmpty: import_prop_types4.default.bool.isRequired,
      className: import_prop_types4.default.string,
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: import_prop_types4.default.elementType,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types4.default.bool.isRequired,
      disableUnderline: import_prop_types4.default.bool,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types4.default.arrayOf(
        import_prop_types4.default.shape({
          after: import_prop_types4.default.object.isRequired,
          before: import_prop_types4.default.object.isRequired,
          container: import_prop_types4.default.object.isRequired,
          content: import_prop_types4.default.object.isRequired,
        })
      ).isRequired,
      endAdornment: import_prop_types4.default.node,
      fullWidth: import_prop_types4.default.bool,
      hiddenLabel: import_prop_types4.default.bool,
      id: import_prop_types4.default.string,
      inputProps: import_prop_types4.default.object,
      inputRef: refType_default,
      label: import_prop_types4.default.node,
      margin: import_prop_types4.default.oneOf(['dense', 'none', 'normal']),
      name: import_prop_types4.default.string,
      onChange: import_prop_types4.default.func.isRequired,
      onClick: import_prop_types4.default.func.isRequired,
      onInput: import_prop_types4.default.func.isRequired,
      onKeyDown: import_prop_types4.default.func.isRequired,
      onPaste: import_prop_types4.default.func.isRequired,
      ownerState: import_prop_types4.default.any,
      readOnly: import_prop_types4.default.bool,
      renderSuffix: import_prop_types4.default.func,
      sectionListRef: import_prop_types4.default.oneOfType([
        import_prop_types4.default.func,
        import_prop_types4.default.shape({
          current: import_prop_types4.default.shape({
            getRoot: import_prop_types4.default.func.isRequired,
            getSectionContainer: import_prop_types4.default.func.isRequired,
            getSectionContent: import_prop_types4.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types4.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types4.default.object,
      /**
       * The components used for each slot inside.
       *
       * @default {}
       */
      slots: import_prop_types4.default.object,
      startAdornment: import_prop_types4.default.node,
      style: import_prop_types4.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types4.default.oneOfType([
        import_prop_types4.default.arrayOf(
          import_prop_types4.default.oneOfType([
            import_prop_types4.default.func,
            import_prop_types4.default.object,
            import_prop_types4.default.bool,
          ])
        ),
        import_prop_types4.default.func,
        import_prop_types4.default.object,
      ]),
      value: import_prop_types4.default.string.isRequired,
    })
  : void 0;
PickersFilledInput.muiName = 'Input';

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInput/PickersInput.js
var React16 = __toESM(require_react());
var import_prop_types5 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInput/pickersInputClasses.js
function getPickersInputUtilityClass(slot) {
  return generateUtilityClass('MuiPickersFilledInput', slot);
}
var pickersInputClasses = _extends(
  {},
  pickersInputBaseClasses,
  generateUtilityClasses('MuiPickersInput', ['root', 'input'])
);

// node_modules/@mui/x-date-pickers/PickersTextField/PickersInput/PickersInput.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var _excluded8 = ['label', 'autoFocus', 'disableUnderline', 'ownerState'];
var PickersInputRoot = styled_default(PickersInputBaseRoot, {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => {
  const light = theme.palette.mode === 'light';
  let bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  if (theme.vars) {
    bottomLineColor = `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`;
  }
  return {
    'label + &': {
      marginTop: 16,
    },
    variants: [
      ...Object.keys((theme.vars ?? theme).palette)
        .filter((key) => (theme.vars ?? theme).palette[key].main)
        .map((color) => ({
          props: {
            color,
          },
          style: {
            '&::after': {
              // @ts-ignore
              borderBottom: `2px solid ${(theme.vars || theme).palette[color].main}`,
            },
          },
        })),
      {
        props: {
          disableUnderline: false,
        },
        style: {
          '&::after': {
            background: 'red',
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '""',
            position: 'absolute',
            right: 0,
            transform: 'scaleX(0)',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeOut,
            }),
            pointerEvents: 'none',
            // Transparent to the hover style.
          },
          [`&.${pickersInputClasses.focused}:after`]: {
            // translateX(0) is a workaround for Safari transform scale bug
            // See https://github.com/mui/material-ui/issues/31766
            transform: 'scaleX(1) translateX(0)',
          },
          [`&.${pickersInputClasses.error}`]: {
            '&:before, &:after': {
              borderBottomColor: (theme.vars || theme).palette.error.main,
            },
          },
          '&::before': {
            borderBottom: `1px solid ${bottomLineColor}`,
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '"\\00a0"',
            position: 'absolute',
            right: 0,
            transition: theme.transitions.create('border-bottom-color', {
              duration: theme.transitions.duration.shorter,
            }),
            pointerEvents: 'none',
            // Transparent to the hover style.
          },
          [`&:hover:not(.${pickersInputClasses.disabled}, .${pickersInputClasses.error}):before`]: {
            borderBottom: `2px solid ${(theme.vars || theme).palette.text.primary}`,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              borderBottom: `1px solid ${bottomLineColor}`,
            },
          },
          [`&.${pickersInputClasses.disabled}:before`]: {
            borderBottomStyle: 'dotted',
          },
        },
      },
    ],
  };
});
var useUtilityClasses5 = (ownerState) => {
  const { classes, disableUnderline } = ownerState;
  const slots = {
    root: ['root', !disableUnderline && 'underline'],
    input: ['input'],
  };
  const composedClasses = composeClasses(slots, getPickersInputUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
var PickersInput = React16.forwardRef(function PickersInput2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersInput',
  });
  const { label, disableUnderline = false, ownerState: ownerStateProp } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded8);
  const muiFormControl = useFormControl();
  const ownerState = _extends({}, props, ownerStateProp, muiFormControl, {
    disableUnderline,
    color: (muiFormControl == null ? void 0 : muiFormControl.color) || 'primary',
  });
  const classes = useUtilityClasses5(ownerState);
  return (0, import_jsx_runtime8.jsx)(
    PickersInputBase,
    _extends(
      {
        slots: {
          root: PickersInputRoot,
        },
      },
      other,
      {
        label,
        classes,
        ref,
      }
    )
  );
});
true
  ? (PickersInput.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Is `true` if the current values equals the empty value.
       * For a single item value, it means that `value === null`
       * For a range value, it means that `value === [null, null]`
       */
      areAllSectionsEmpty: import_prop_types5.default.bool.isRequired,
      className: import_prop_types5.default.string,
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: import_prop_types5.default.elementType,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types5.default.bool.isRequired,
      disableUnderline: import_prop_types5.default.bool,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types5.default.arrayOf(
        import_prop_types5.default.shape({
          after: import_prop_types5.default.object.isRequired,
          before: import_prop_types5.default.object.isRequired,
          container: import_prop_types5.default.object.isRequired,
          content: import_prop_types5.default.object.isRequired,
        })
      ).isRequired,
      endAdornment: import_prop_types5.default.node,
      fullWidth: import_prop_types5.default.bool,
      id: import_prop_types5.default.string,
      inputProps: import_prop_types5.default.object,
      inputRef: refType_default,
      label: import_prop_types5.default.node,
      margin: import_prop_types5.default.oneOf(['dense', 'none', 'normal']),
      name: import_prop_types5.default.string,
      onChange: import_prop_types5.default.func.isRequired,
      onClick: import_prop_types5.default.func.isRequired,
      onInput: import_prop_types5.default.func.isRequired,
      onKeyDown: import_prop_types5.default.func.isRequired,
      onPaste: import_prop_types5.default.func.isRequired,
      ownerState: import_prop_types5.default.any,
      readOnly: import_prop_types5.default.bool,
      renderSuffix: import_prop_types5.default.func,
      sectionListRef: import_prop_types5.default.oneOfType([
        import_prop_types5.default.func,
        import_prop_types5.default.shape({
          current: import_prop_types5.default.shape({
            getRoot: import_prop_types5.default.func.isRequired,
            getSectionContainer: import_prop_types5.default.func.isRequired,
            getSectionContent: import_prop_types5.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types5.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types5.default.object,
      /**
       * The components used for each slot inside.
       *
       * @default {}
       */
      slots: import_prop_types5.default.object,
      startAdornment: import_prop_types5.default.node,
      style: import_prop_types5.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types5.default.oneOfType([
        import_prop_types5.default.arrayOf(
          import_prop_types5.default.oneOfType([
            import_prop_types5.default.func,
            import_prop_types5.default.object,
            import_prop_types5.default.bool,
          ])
        ),
        import_prop_types5.default.func,
        import_prop_types5.default.object,
      ]),
      value: import_prop_types5.default.string.isRequired,
    })
  : void 0;
PickersInput.muiName = 'Input';

// node_modules/@mui/x-date-pickers/PickersTextField/PickersTextField.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var _excluded9 = [
  'onFocus',
  'onBlur',
  'className',
  'color',
  'disabled',
  'error',
  'variant',
  'required',
  'InputProps',
  'inputProps',
  'inputRef',
  'sectionListRef',
  'elements',
  'areAllSectionsEmpty',
  'onClick',
  'onKeyDown',
  'onKeyUp',
  'onPaste',
  'onInput',
  'endAdornment',
  'startAdornment',
  'tabIndex',
  'contentEditable',
  'focused',
  'value',
  'onChange',
  'fullWidth',
  'id',
  'name',
  'helperText',
  'FormHelperTextProps',
  'label',
  'InputLabelProps',
];
var VARIANT_COMPONENT = {
  standard: PickersInput,
  filled: PickersFilledInput,
  outlined: PickersOutlinedInput,
};
var PickersTextFieldRoot = styled_default(FormControl_default, {
  name: 'MuiPickersTextField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  maxWidth: '100%',
});
var useUtilityClasses6 = (ownerState) => {
  const { focused, disabled, classes, required } = ownerState;
  const slots = {
    root: [
      'root',
      focused && !disabled && 'focused',
      disabled && 'disabled',
      required && 'required',
    ],
  };
  return composeClasses(slots, getPickersTextFieldUtilityClass, classes);
};
var PickersTextField = React17.forwardRef(function PickersTextField2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersTextField',
  });
  const {
      // Props used by FormControl
      onFocus,
      onBlur,
      className,
      color = 'primary',
      disabled = false,
      error = false,
      variant = 'outlined',
      required = false,
      // Props used by PickersInput
      InputProps,
      inputProps,
      inputRef,
      sectionListRef,
      elements,
      areAllSectionsEmpty,
      onClick,
      onKeyDown,
      onKeyUp,
      onPaste,
      onInput,
      endAdornment,
      startAdornment,
      tabIndex,
      contentEditable,
      focused,
      value,
      onChange,
      fullWidth,
      id: idProp,
      name,
      // Props used by FormHelperText
      helperText,
      FormHelperTextProps,
      // Props used by InputLabel
      label,
      InputLabelProps,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded9);
  const rootRef = React17.useRef(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const id = useId(idProp);
  const helperTextId = helperText && id ? `${id}-helper-text` : void 0;
  const inputLabelId = label && id ? `${id}-label` : void 0;
  const ownerState = _extends({}, props, {
    color,
    disabled,
    error,
    focused,
    required,
    variant,
  });
  const classes = useUtilityClasses6(ownerState);
  const PickersInputComponent = VARIANT_COMPONENT[variant];
  return (0, import_jsx_runtime9.jsxs)(
    PickersTextFieldRoot,
    _extends(
      {
        className: clsx_default(classes.root, className),
        ref: handleRootRef,
        focused,
        onFocus,
        onBlur,
        disabled,
        variant,
        error,
        color,
        fullWidth,
        required,
        ownerState,
      },
      other,
      {
        children: [
          (0, import_jsx_runtime9.jsx)(
            InputLabel_default,
            _extends(
              {
                htmlFor: id,
                id: inputLabelId,
              },
              InputLabelProps,
              {
                children: label,
              }
            )
          ),
          (0, import_jsx_runtime9.jsx)(
            PickersInputComponent,
            _extends(
              {
                elements,
                areAllSectionsEmpty,
                onClick,
                onKeyDown,
                onKeyUp,
                onInput,
                onPaste,
                endAdornment,
                startAdornment,
                tabIndex,
                contentEditable,
                value,
                onChange,
                id,
                fullWidth,
                inputProps,
                inputRef,
                sectionListRef,
                label,
                name,
                role: 'group',
                'aria-labelledby': inputLabelId,
                'aria-describedby': helperTextId,
                'aria-live': helperTextId ? 'polite' : void 0,
              },
              InputProps
            )
          ),
          helperText &&
            (0, import_jsx_runtime9.jsx)(
              FormHelperText_default,
              _extends(
                {
                  id: helperTextId,
                },
                FormHelperTextProps,
                {
                  children: helperText,
                }
              )
            ),
        ],
      }
    )
  );
});
true
  ? (PickersTextField.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Is `true` if the current values equals the empty value.
       * For a single item value, it means that `value === null`
       * For a range value, it means that `value === [null, null]`
       */
      areAllSectionsEmpty: import_prop_types6.default.bool.isRequired,
      className: import_prop_types6.default.string,
      /**
       * The color of the component.
       * It supports both default and custom theme colors, which can be added as shown in the
       * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
       * @default 'primary'
       */
      color: import_prop_types6.default.oneOf([
        'error',
        'info',
        'primary',
        'secondary',
        'success',
        'warning',
      ]),
      component: import_prop_types6.default.elementType,
      /**
       * If true, the whole element is editable.
       * Useful when all the sections are selected.
       */
      contentEditable: import_prop_types6.default.bool.isRequired,
      disabled: import_prop_types6.default.bool.isRequired,
      /**
       * The elements to render.
       * Each element contains the prop to edit a section of the value.
       */
      elements: import_prop_types6.default.arrayOf(
        import_prop_types6.default.shape({
          after: import_prop_types6.default.object.isRequired,
          before: import_prop_types6.default.object.isRequired,
          container: import_prop_types6.default.object.isRequired,
          content: import_prop_types6.default.object.isRequired,
        })
      ).isRequired,
      endAdornment: import_prop_types6.default.node,
      error: import_prop_types6.default.bool.isRequired,
      /**
       * If `true`, the component is displayed in focused state.
       */
      focused: import_prop_types6.default.bool,
      FormHelperTextProps: import_prop_types6.default.object,
      fullWidth: import_prop_types6.default.bool,
      /**
       * The helper text content.
       */
      helperText: import_prop_types6.default.node,
      /**
       * If `true`, the label is hidden.
       * This is used to increase density for a `FilledInput`.
       * Be sure to add `aria-label` to the `input` element.
       * @default false
       */
      hiddenLabel: import_prop_types6.default.bool,
      id: import_prop_types6.default.string,
      InputLabelProps: import_prop_types6.default.object,
      inputProps: import_prop_types6.default.object,
      /**
       * Props applied to the Input element.
       * It will be a [`FilledInput`](/material-ui/api/filled-input/),
       * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
       * component depending on the `variant` prop value.
       */
      InputProps: import_prop_types6.default.object,
      inputRef: refType_default,
      label: import_prop_types6.default.node,
      /**
       * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
       * @default 'none'
       */
      margin: import_prop_types6.default.oneOf(['dense', 'none', 'normal']),
      name: import_prop_types6.default.string,
      onBlur: import_prop_types6.default.func.isRequired,
      onChange: import_prop_types6.default.func.isRequired,
      onClick: import_prop_types6.default.func.isRequired,
      onFocus: import_prop_types6.default.func.isRequired,
      onInput: import_prop_types6.default.func.isRequired,
      onKeyDown: import_prop_types6.default.func.isRequired,
      onPaste: import_prop_types6.default.func.isRequired,
      readOnly: import_prop_types6.default.bool,
      /**
       * If `true`, the label will indicate that the `input` is required.
       * @default false
       */
      required: import_prop_types6.default.bool,
      sectionListRef: import_prop_types6.default.oneOfType([
        import_prop_types6.default.func,
        import_prop_types6.default.shape({
          current: import_prop_types6.default.shape({
            getRoot: import_prop_types6.default.func.isRequired,
            getSectionContainer: import_prop_types6.default.func.isRequired,
            getSectionContent: import_prop_types6.default.func.isRequired,
            getSectionIndexFromDOMElement: import_prop_types6.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * The size of the component.
       * @default 'medium'
       */
      size: import_prop_types6.default.oneOf(['medium', 'small']),
      startAdornment: import_prop_types6.default.node,
      style: import_prop_types6.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types6.default.oneOfType([
        import_prop_types6.default.arrayOf(
          import_prop_types6.default.oneOfType([
            import_prop_types6.default.func,
            import_prop_types6.default.object,
            import_prop_types6.default.bool,
          ])
        ),
        import_prop_types6.default.func,
        import_prop_types6.default.object,
      ]),
      value: import_prop_types6.default.string.isRequired,
      /**
       * The variant to use.
       * @default 'outlined'
       */
      variant: import_prop_types6.default.oneOf(['filled', 'outlined', 'standard']),
    })
  : void 0;

// node_modules/@mui/x-date-pickers/internals/utils/convertFieldResponseIntoMuiTextFieldProps.js
var _excluded10 = ['enableAccessibleFieldDOMStructure'];
var _excluded22 = ['InputProps', 'readOnly'];
var _excluded32 = [
  'onPaste',
  'onKeyDown',
  'inputMode',
  'readOnly',
  'InputProps',
  'inputProps',
  'inputRef',
];
var convertFieldResponseIntoMuiTextFieldProps = (_ref) => {
  let { enableAccessibleFieldDOMStructure } = _ref,
    fieldResponse = _objectWithoutPropertiesLoose(_ref, _excluded10);
  if (enableAccessibleFieldDOMStructure) {
    const { InputProps: InputProps2, readOnly: readOnly2 } = fieldResponse,
      other2 = _objectWithoutPropertiesLoose(fieldResponse, _excluded22);
    return _extends({}, other2, {
      InputProps: _extends({}, InputProps2 ?? {}, {
        readOnly: readOnly2,
      }),
    });
  }
  const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef } =
      fieldResponse,
    other = _objectWithoutPropertiesLoose(fieldResponse, _excluded32);
  return _extends({}, other, {
    InputProps: _extends({}, InputProps ?? {}, {
      readOnly,
    }),
    inputProps: _extends({}, inputProps ?? {}, {
      inputMode,
      onPaste,
      onKeyDown,
      ref: inputRef,
    }),
  });
};

// node_modules/@mui/x-date-pickers/DateField/DateField.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var _excluded11 = ['slots', 'slotProps', 'InputProps', 'inputProps'];
var DateField = React18.forwardRef(function DateField2(inProps, inRef) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiDateField',
  });
  const { slots, slotProps, InputProps, inputProps } = themeProps,
    other = _objectWithoutPropertiesLoose(themeProps, _excluded11);
  const ownerState = themeProps;
  const TextField =
    (slots == null ? void 0 : slots.textField) ??
    (inProps.enableAccessibleFieldDOMStructure ? PickersTextField : TextField_default);
  const textFieldProps = useSlotProps_default({
    elementType: TextField,
    externalSlotProps: slotProps == null ? void 0 : slotProps.textField,
    externalForwardedProps: other,
    additionalProps: {
      ref: inRef,
    },
    ownerState,
  });
  textFieldProps.inputProps = _extends({}, inputProps, textFieldProps.inputProps);
  textFieldProps.InputProps = _extends({}, InputProps, textFieldProps.InputProps);
  const fieldResponse = useDateField(textFieldProps);
  const convertedFieldResponse = convertFieldResponseIntoMuiTextFieldProps(fieldResponse);
  const processedFieldProps = useClearableField(
    _extends({}, convertedFieldResponse, {
      slots,
      slotProps,
    })
  );
  return (0, import_jsx_runtime10.jsx)(TextField, _extends({}, processedFieldProps));
});
true
  ? (DateField.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * If `true`, the `input` element is focused during the first mount.
       * @default false
       */
      autoFocus: import_prop_types7.default.bool,
      className: import_prop_types7.default.string,
      /**
       * If `true`, a clear button will be shown in the field allowing value clearing.
       * @default false
       */
      clearable: import_prop_types7.default.bool,
      /**
       * The color of the component.
       * It supports both default and custom theme colors, which can be added as shown in the
       * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
       * @default 'primary'
       */
      color: import_prop_types7.default.oneOf([
        'error',
        'info',
        'primary',
        'secondary',
        'success',
        'warning',
      ]),
      component: import_prop_types7.default.elementType,
      /**
       * The default value. Use when the component is not controlled.
       */
      defaultValue: import_prop_types7.default.object,
      /**
       * If `true`, the component is disabled.
       * @default false
       */
      disabled: import_prop_types7.default.bool,
      /**
       * If `true`, disable values after the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disableFuture: import_prop_types7.default.bool,
      /**
       * If `true`, disable values before the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disablePast: import_prop_types7.default.bool,
      /**
       * @default false
       */
      enableAccessibleFieldDOMStructure: import_prop_types7.default.bool,
      /**
       * If `true`, the component is displayed in focused state.
       */
      focused: import_prop_types7.default.bool,
      /**
       * Format of the date when rendered in the input(s).
       */
      format: import_prop_types7.default.string,
      /**
       * Density of the format when rendered in the input.
       * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
       * @default "dense"
       */
      formatDensity: import_prop_types7.default.oneOf(['dense', 'spacious']),
      /**
       * Props applied to the [`FormHelperText`](/material-ui/api/form-helper-text/) element.
       */
      FormHelperTextProps: import_prop_types7.default.object,
      /**
       * If `true`, the input will take up the full width of its container.
       * @default false
       */
      fullWidth: import_prop_types7.default.bool,
      /**
       * The helper text content.
       */
      helperText: import_prop_types7.default.node,
      /**
       * If `true`, the label is hidden.
       * This is used to increase density for a `FilledInput`.
       * Be sure to add `aria-label` to the `input` element.
       * @default false
       */
      hiddenLabel: import_prop_types7.default.bool,
      /**
       * The id of the `input` element.
       * Use this prop to make `label` and `helperText` accessible for screen readers.
       */
      id: import_prop_types7.default.string,
      /**
       * Props applied to the [`InputLabel`](/material-ui/api/input-label/) element.
       * Pointer events like `onClick` are enabled if and only if `shrink` is `true`.
       */
      InputLabelProps: import_prop_types7.default.object,
      /**
       * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
       */
      inputProps: import_prop_types7.default.object,
      /**
       * Props applied to the Input element.
       * It will be a [`FilledInput`](/material-ui/api/filled-input/),
       * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
       * component depending on the `variant` prop value.
       */
      InputProps: import_prop_types7.default.object,
      /**
       * Pass a ref to the `input` element.
       */
      inputRef: refType_default,
      /**
       * The label content.
       */
      label: import_prop_types7.default.node,
      /**
       * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
       * @default 'none'
       */
      margin: import_prop_types7.default.oneOf(['dense', 'none', 'normal']),
      /**
       * Maximal selectable date.
       * @default 2099-12-31
       */
      maxDate: import_prop_types7.default.object,
      /**
       * Minimal selectable date.
       * @default 1900-01-01
       */
      minDate: import_prop_types7.default.object,
      /**
       * Name attribute of the `input` element.
       */
      name: import_prop_types7.default.string,
      onBlur: import_prop_types7.default.func,
      /**
       * Callback fired when the value changes.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
       * @param {TValue} value The new value.
       * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
       */
      onChange: import_prop_types7.default.func,
      /**
       * Callback fired when the clear button is clicked.
       */
      onClear: import_prop_types7.default.func,
      /**
       * Callback fired when the error associated with the current value changes.
       * When a validation error is detected, the `error` parameter contains a non-null value.
       * This can be used to render an appropriate form error.
       * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @param {TError} error The reason why the current value is not valid.
       * @param {TValue} value The value associated with the error.
       */
      onError: import_prop_types7.default.func,
      onFocus: import_prop_types7.default.func,
      /**
       * Callback fired when the selected sections change.
       * @param {FieldSelectedSections} newValue The new selected sections.
       */
      onSelectedSectionsChange: import_prop_types7.default.func,
      /**
       * It prevents the user from changing the value of the field
       * (not from interacting with the field).
       * @default false
       */
      readOnly: import_prop_types7.default.bool,
      /**
       * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
       * For example, on time fields it will be used to determine the date to set.
       * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
       */
      referenceDate: import_prop_types7.default.object,
      /**
       * If `true`, the label is displayed as required and the `input` element is required.
       * @default false
       */
      required: import_prop_types7.default.bool,
      /**
       * The currently selected sections.
       * This prop accepts four formats:
       * 1. If a number is provided, the section at this index will be selected.
       * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
       * 3. If `"all"` is provided, all the sections will be selected.
       * 4. If `null` is provided, no section will be selected.
       * If not provided, the selected sections will be handled internally.
       */
      selectedSections: import_prop_types7.default.oneOfType([
        import_prop_types7.default.oneOf([
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
        import_prop_types7.default.number,
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
      shouldDisableDate: import_prop_types7.default.func,
      /**
       * Disable specific month.
       * @template TDate
       * @param {TDate} month The month to test.
       * @returns {boolean} If `true`, the month will be disabled.
       */
      shouldDisableMonth: import_prop_types7.default.func,
      /**
       * Disable specific year.
       * @template TDate
       * @param {TDate} year The year to test.
       * @returns {boolean} If `true`, the year will be disabled.
       */
      shouldDisableYear: import_prop_types7.default.func,
      /**
       * If `true`, the format will respect the leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
       * If `false`, the format will always add leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
       *
       * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (e.g: "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
       *
       * Warning n°2: When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
       * If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
       *
       * Warning n°3: When used in strict mode, dayjs and moment require to respect the leading zeros.
       * This mean that when using `shouldRespectLeadingZeros={false}`, if you retrieve the value directly from the input (not listening to `onChange`) and your format contains tokens without leading zeros, the value will not be parsed by your library.
       *
       * @default false
       */
      shouldRespectLeadingZeros: import_prop_types7.default.bool,
      /**
       * The size of the component.
       */
      size: import_prop_types7.default.oneOf(['medium', 'small']),
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types7.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types7.default.object,
      style: import_prop_types7.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types7.default.oneOfType([
        import_prop_types7.default.arrayOf(
          import_prop_types7.default.oneOfType([
            import_prop_types7.default.func,
            import_prop_types7.default.object,
            import_prop_types7.default.bool,
          ])
        ),
        import_prop_types7.default.func,
        import_prop_types7.default.object,
      ]),
      /**
       * Choose which timezone to use for the value.
       * Example: "default", "system", "UTC", "America/New_York".
       * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
       * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
       * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
       */
      timezone: import_prop_types7.default.string,
      /**
       * The ref object used to imperatively interact with the field.
       */
      unstableFieldRef: import_prop_types7.default.oneOfType([
        import_prop_types7.default.func,
        import_prop_types7.default.object,
      ]),
      /**
       * The selected value.
       * Used when the component is controlled.
       */
      value: import_prop_types7.default.object,
      /**
       * The variant to use.
       * @default 'outlined'
       */
      variant: import_prop_types7.default.oneOf(['filled', 'outlined', 'standard']),
    })
  : void 0;

export { PickersProvider, DateField };
//# sourceMappingURL=chunk-HIUUD5QW.js.map
