import { warnOnce } from './chunk-Q2BLGLKS.js';
import { MuiPickersAdapterContext } from './chunk-H6NMVBYL.js';
import {
  Button_default,
  DialogActions_default,
  ListItem_default,
  useMediaQuery_default,
} from './chunk-PIQCQMOU.js';
import { IconButton_default } from './chunk-KB5IAXBX.js';
import { Chip_default } from './chunk-FLREA366.js';
import { Typography_default } from './chunk-UXCVDSBK.js';
import { ButtonBase_default } from './chunk-KJFRVT6X.js';
import { Fade_default, List_default } from './chunk-4BY54NEZ.js';
import { CSSTransition_default, TransitionGroup_default } from './chunk-TA6DHASC.js';
import { _objectWithoutPropertiesLoose } from './chunk-AVUONKA5.js';
import { useThemeProps } from './chunk-43B4C3OA.js';
import { createSvgIcon } from './chunk-LJW5SMYV.js';
import { styled_default, useTheme } from './chunk-2XAE2ENI.js';
import { alpha, useRtl } from './chunk-TZHUOUWG.js';
import { require_prop_types } from './chunk-QDMWOECB.js';
import { clsx_default } from './chunk-2KHBIA62.js';
import { _extends } from './chunk-HQ6ZTAWL.js';
import { require_jsx_runtime } from './chunk-3UUIVEWB.js';
import { require_react } from './chunk-QJ3FMQXC.js';
import { __commonJS, __publicField, __toESM } from './chunk-SNAQBZPT.js';

// node_modules/@mui/x-date-pickers/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  'node_modules/@mui/x-date-pickers/node_modules/react-is/cjs/react-is.development.js'(exports) {
    'use strict';
    (function () {
      function typeOf(object) {
        if ('object' === typeof object && null !== object) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              switch (((object = object.type), object)) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                case REACT_VIEW_TRANSITION_TYPE:
                  return object;
                default:
                  switch (((object = object && object.$$typeof), object)) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                      return object;
                    case REACT_CONSUMER_TYPE:
                      return object;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
      }
      var REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element'),
        REACT_PORTAL_TYPE = Symbol.for('react.portal'),
        REACT_FRAGMENT_TYPE = Symbol.for('react.fragment'),
        REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode'),
        REACT_PROFILER_TYPE = Symbol.for('react.profiler'),
        REACT_CONSUMER_TYPE = Symbol.for('react.consumer'),
        REACT_CONTEXT_TYPE = Symbol.for('react.context'),
        REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref'),
        REACT_SUSPENSE_TYPE = Symbol.for('react.suspense'),
        REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list'),
        REACT_MEMO_TYPE = Symbol.for('react.memo'),
        REACT_LAZY_TYPE = Symbol.for('react.lazy'),
        REACT_VIEW_TRANSITION_TYPE = Symbol.for('react.view_transition'),
        REACT_CLIENT_REFERENCE = Symbol.for('react.client.reference');
      exports.ContextConsumer = REACT_CONSUMER_TYPE;
      exports.ContextProvider = REACT_CONTEXT_TYPE;
      exports.Element = REACT_ELEMENT_TYPE;
      exports.ForwardRef = REACT_FORWARD_REF_TYPE;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Lazy = REACT_LAZY_TYPE;
      exports.Memo = REACT_MEMO_TYPE;
      exports.Portal = REACT_PORTAL_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
      exports.isContextConsumer = function (object) {
        return typeOf(object) === REACT_CONSUMER_TYPE;
      };
      exports.isContextProvider = function (object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      };
      exports.isElement = function (object) {
        return (
          'object' === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE
        );
      };
      exports.isForwardRef = function (object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      };
      exports.isFragment = function (object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      };
      exports.isLazy = function (object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      };
      exports.isMemo = function (object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      };
      exports.isPortal = function (object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      };
      exports.isProfiler = function (object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      };
      exports.isStrictMode = function (object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      };
      exports.isSuspense = function (object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      };
      exports.isSuspenseList = function (object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      };
      exports.isValidElementType = function (type) {
        return 'string' === typeof type ||
          'function' === typeof type ||
          type === REACT_FRAGMENT_TYPE ||
          type === REACT_PROFILER_TYPE ||
          type === REACT_STRICT_MODE_TYPE ||
          type === REACT_SUSPENSE_TYPE ||
          type === REACT_SUSPENSE_LIST_TYPE ||
          ('object' === typeof type &&
            null !== type &&
            (type.$$typeof === REACT_LAZY_TYPE ||
              type.$$typeof === REACT_MEMO_TYPE ||
              type.$$typeof === REACT_CONTEXT_TYPE ||
              type.$$typeof === REACT_CONSUMER_TYPE ||
              type.$$typeof === REACT_FORWARD_REF_TYPE ||
              type.$$typeof === REACT_CLIENT_REFERENCE ||
              void 0 !== type.getModuleId))
          ? true
          : false;
      };
      exports.typeOf = typeOf;
    })();
  },
});

// node_modules/@mui/x-date-pickers/node_modules/react-is/index.js
var require_react_is = __commonJS({
  'node_modules/@mui/x-date-pickers/node_modules/react-is/index.js'(exports, module) {
    'use strict';
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  },
});

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/chainPropTypes/chainPropTypes.js
function chainPropTypes(propType1, propType2) {
  if (false) {
    return () => null;
  }
  return function validate(...args) {
    return propType1(...args) || propType2(...args);
  };
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/deepmerge/deepmerge.js
var React = __toESM(require_react(), 1);
var import_react_is = __toESM(require_react_is(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/elementAcceptingRef/elementAcceptingRef.js
var import_prop_types = __toESM(require_prop_types(), 1);
function isClassComponent(elementType) {
  const { prototype = {} } = elementType;
  return Boolean(prototype.isReactComponent);
}
function acceptingRef(props, propName, componentName, location, propFullName) {
  const element = props[propName];
  const safePropName = propFullName || propName;
  if (
    element == null || // When server-side rendering React doesn't warn either.
    // This is not an accurate check for SSR.
    // This is only in place for Emotion compat.
    // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
    typeof window === 'undefined'
  ) {
    return null;
  }
  let warningHint;
  const elementType = element.type;
  if (typeof elementType === 'function' && !isClassComponent(elementType)) {
    warningHint = 'Did you accidentally use a plain function component for an element instead?';
  }
  if (warningHint !== void 0) {
    return new Error(
      `Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`
    );
  }
  return null;
}
var elementAcceptingRef = chainPropTypes(import_prop_types.default.element, acceptingRef);
elementAcceptingRef.isRequired = chainPropTypes(
  import_prop_types.default.element.isRequired,
  acceptingRef
);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/elementTypeAcceptingRef/elementTypeAcceptingRef.js
var import_prop_types2 = __toESM(require_prop_types(), 1);
var React2 = __toESM(require_react(), 1);
function isClassComponent2(elementType) {
  const { prototype = {} } = elementType;
  return Boolean(prototype.isReactComponent);
}
function elementTypeAcceptingRef(props, propName, componentName, location, propFullName) {
  const propValue = props[propName];
  const safePropName = propFullName || propName;
  if (
    propValue == null || // When server-side rendering React doesn't warn either.
    // This is not an accurate check for SSR.
    // This is only in place for emotion compat.
    // TODO: Revisit once https://github.com/facebook/react/issues/20047 is resolved.
    typeof window === 'undefined'
  ) {
    return null;
  }
  let warningHint;
  if (typeof propValue === 'function' && !isClassComponent2(propValue)) {
    warningHint = 'Did you accidentally provide a plain function component instead?';
  }
  if (propValue === React2.Fragment) {
    warningHint = 'Did you accidentally provide a React.Fragment instead?';
  }
  if (warningHint !== void 0) {
    return new Error(
      `Invalid ${location} \`${safePropName}\` supplied to \`${componentName}\`. Expected an element type that can hold a ref. ${warningHint} For more information see https://mui.com/r/caveat-with-refs-guide`
    );
  }
  return null;
}
var elementTypeAcceptingRef_default = chainPropTypes(
  import_prop_types2.default.elementType,
  elementTypeAcceptingRef
);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/getDisplayName/getDisplayName.js
var import_react_is2 = __toESM(require_react_is(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/ponyfillGlobal/ponyfillGlobal.js
var ponyfillGlobal_default =
  typeof window != 'undefined' && window.Math == Math
    ? window
    : typeof self != 'undefined' && self.Math == Math
      ? self
      : Function('return this')();

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/refType/refType.js
var import_prop_types3 = __toESM(require_prop_types(), 1);
var refType = import_prop_types3.default.oneOfType([
  import_prop_types3.default.func,
  import_prop_types3.default.object,
]);
var refType_default = refType;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/capitalize/capitalize.js
function capitalize(string) {
  if (typeof string !== 'string') {
    throw new Error(
      true ? 'MUI: `capitalize(string)` expects a string argument.' : formatMuiErrorMessage(7)
    );
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/isMuiElement/isMuiElement.js
var React3 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/ownerDocument/ownerDocument.js
function ownerDocument(node) {
  return (node && node.ownerDocument) || document;
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js
var React4 = __toESM(require_react(), 1);
var useEnhancedEffect = typeof window !== 'undefined' ? React4.useLayoutEffect : React4.useEffect;
var useEnhancedEffect_default = useEnhancedEffect;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useId/useId.js
var React5 = __toESM(require_react(), 1);
var globalId = 0;
function useGlobalId(idOverride) {
  const [defaultId, setDefaultId] = React5.useState(idOverride);
  const id = idOverride || defaultId;
  React5.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`mui-${globalId}`);
    }
  }, [defaultId]);
  return id;
}
var safeReact = {
  ...React5,
};
var maybeReactUseId = safeReact.useId;
function useId(idOverride) {
  if (maybeReactUseId !== void 0) {
    const reactId = maybeReactUseId();
    return idOverride ?? reactId;
  }
  return useGlobalId(idOverride);
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useControlled/useControlled.js
var React6 = __toESM(require_react(), 1);
function useControlled(props) {
  const { controlled, default: defaultProp, name, state = 'value' } = props;
  const { current: isControlled } = React6.useRef(controlled !== void 0);
  const [valueState, setValue] = React6.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  if (true) {
    React6.useEffect(() => {
      if (isControlled !== (controlled !== void 0)) {
        console.error(
          [
            `MUI: A component is changing the ${isControlled ? '' : 'un'}controlled ${state} state of ${name} to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`,
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n')
        );
      }
    }, [state, name, controlled]);
    const { current: defaultValue } = React6.useRef(defaultProp);
    React6.useEffect(() => {
      if (!isControlled && JSON.stringify(defaultProp) !== JSON.stringify(defaultValue)) {
        console.error(
          [
            `MUI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`,
          ].join('\n')
        );
      }
    }, [JSON.stringify(defaultProp)]);
  }
  const setValueIfUncontrolled = React6.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js
var React7 = __toESM(require_react(), 1);
function useEventCallback(fn) {
  const ref = React7.useRef(fn);
  useEnhancedEffect_default(() => {
    ref.current = fn;
  });
  return React7.useRef((...args) =>
    // @ts-expect-error hide `this`
    (0, ref.current)(...args)
  ).current;
}
var useEventCallback_default = useEventCallback;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useForkRef/useForkRef.js
var React8 = __toESM(require_react(), 1);
function useForkRef(...refs) {
  const cleanupRef = React8.useRef(void 0);
  const refEffect = React8.useCallback((instance) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return null;
      }
      if (typeof ref === 'function') {
        const refCallback = ref;
        const refCleanup = refCallback(instance);
        return typeof refCleanup === 'function'
          ? refCleanup
          : () => {
              refCallback(null);
            };
      }
      ref.current = instance;
      return () => {
        ref.current = null;
      };
    });
    return () => {
      cleanups.forEach((refCleanup) => (refCleanup == null ? void 0 : refCleanup()));
    };
  }, refs);
  return React8.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = void 0;
      }
      if (value != null) {
        cleanupRef.current = refEffect(value);
      }
    };
  }, refs);
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useLazyRef/useLazyRef.js
var React9 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useOnMount/useOnMount.js
var React10 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useTimeout/useTimeout.js
var Timeout = class _Timeout {
  constructor() {
    __publicField(this, 'currentId', null);
    __publicField(this, 'clear', () => {
      if (this.currentId !== null) {
        clearTimeout(this.currentId);
        this.currentId = null;
      }
    });
    __publicField(this, 'disposeEffect', () => {
      return this.clear;
    });
  }
  static create() {
    return new _Timeout();
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  start(delay, fn) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = null;
      fn();
    }, delay);
  }
};

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useIsFocusVisible/useIsFocusVisible.js
var React11 = __toESM(require_react(), 1);
var hadFocusVisibleRecentlyTimeout = new Timeout();

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/usePreviousProps/usePreviousProps.js
var React12 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/getValidReactChildren/getValidReactChildren.js
var React13 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/visuallyHidden/visuallyHidden.js
var visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};
var visuallyHidden_default = visuallyHidden;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/integerPropType/integerPropType.js
function getTypeByValue(value) {
  const valueType = typeof value;
  switch (valueType) {
    case 'number':
      if (Number.isNaN(value)) {
        return 'NaN';
      }
      if (!Number.isFinite(value)) {
        return 'Infinity';
      }
      if (value !== Math.floor(value)) {
        return 'float';
      }
      return 'number';
    case 'object':
      if (value === null) {
        return 'null';
      }
      return value.constructor.name;
    default:
      return valueType;
  }
}
function requiredInteger(props, propName, componentName, location) {
  const propValue = props[propName];
  if (propValue == null || !Number.isInteger(propValue)) {
    const propType = getTypeByValue(propValue);
    return new RangeError(
      `Invalid ${location} \`${propName}\` of type \`${propType}\` supplied to \`${componentName}\`, expected \`integer\`.`
    );
  }
  return null;
}
function validator(props, propName, componentName, location) {
  const propValue = props[propName];
  if (propValue === void 0) {
    return null;
  }
  return requiredInteger(props, propName, componentName, location);
}
function validatorNoop() {
  return null;
}
validator.isRequired = requiredInteger;
validatorNoop.isRequired = validatorNoop;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/composeClasses/composeClasses.js
function composeClasses(slots, getUtilityClass, classes = void 0) {
  const output = {};
  for (const slotName in slots) {
    const slot = slots[slotName];
    let buffer = '';
    let start = true;
    for (let i = 0; i < slot.length; i += 1) {
      const value = slot[i];
      if (value) {
        buffer += (start === true ? '' : ' ') + getUtilityClass(value);
        start = false;
        if (classes && classes[value]) {
          buffer += ' ' + classes[value];
        }
      }
    }
    output[slotName] = buffer;
  }
  return output;
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/ClassNameGenerator/ClassNameGenerator.js
var defaultGenerator = (componentName) => componentName;
var createClassNameGenerator = () => {
  let generate = defaultGenerator;
  return {
    configure(generator) {
      generate = generator;
    },
    generate(componentName) {
      return generate(componentName);
    },
    reset() {
      generate = defaultGenerator;
    },
  };
};
var ClassNameGenerator = createClassNameGenerator();
var ClassNameGenerator_default = ClassNameGenerator;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js
var globalStateClasses = {
  active: 'active',
  checked: 'checked',
  completed: 'completed',
  disabled: 'disabled',
  error: 'error',
  expanded: 'expanded',
  focused: 'focused',
  focusVisible: 'focusVisible',
  open: 'open',
  readOnly: 'readOnly',
  required: 'required',
  selected: 'selected',
};
function generateUtilityClass(componentName, slot, globalStatePrefix = 'Mui') {
  const globalStateClass = globalStateClasses[slot];
  return globalStateClass
    ? `${globalStatePrefix}-${globalStateClass}`
    : `${ClassNameGenerator_default.generate(componentName)}-${slot}`;
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js
function generateUtilityClasses(componentName, slots, globalStatePrefix = 'Mui') {
  const result = {};
  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
  });
  return result;
}

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/isHostComponent/isHostComponent.js
function isHostComponent(element) {
  return typeof element === 'string';
}
var isHostComponent_default = isHostComponent;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/appendOwnerState/appendOwnerState.js
function appendOwnerState(elementType, otherProps, ownerState) {
  if (elementType === void 0 || isHostComponent_default(elementType)) {
    return otherProps;
  }
  return {
    ...otherProps,
    ownerState: {
      ...otherProps.ownerState,
      ...ownerState,
    },
  };
}
var appendOwnerState_default = appendOwnerState;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/extractEventHandlers/extractEventHandlers.js
function extractEventHandlers(object, excludeKeys = []) {
  if (object === void 0) {
    return {};
  }
  const result = {};
  Object.keys(object)
    .filter(
      (prop) =>
        prop.match(/^on[A-Z]/) && typeof object[prop] === 'function' && !excludeKeys.includes(prop)
    )
    .forEach((prop) => {
      result[prop] = object[prop];
    });
  return result;
}
var extractEventHandlers_default = extractEventHandlers;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/omitEventHandlers/omitEventHandlers.js
function omitEventHandlers(object) {
  if (object === void 0) {
    return {};
  }
  const result = {};
  Object.keys(object)
    .filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === 'function'))
    .forEach((prop) => {
      result[prop] = object[prop];
    });
  return result;
}
var omitEventHandlers_default = omitEventHandlers;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/mergeSlotProps/mergeSlotProps.js
function mergeSlotProps(parameters) {
  const { getSlotProps, additionalProps, externalSlotProps, externalForwardedProps, className } =
    parameters;
  if (!getSlotProps) {
    const joinedClasses2 = clsx_default(
      additionalProps == null ? void 0 : additionalProps.className,
      className,
      externalForwardedProps == null ? void 0 : externalForwardedProps.className,
      externalSlotProps == null ? void 0 : externalSlotProps.className
    );
    const mergedStyle2 = {
      ...(additionalProps == null ? void 0 : additionalProps.style),
      ...(externalForwardedProps == null ? void 0 : externalForwardedProps.style),
      ...(externalSlotProps == null ? void 0 : externalSlotProps.style),
    };
    const props2 = {
      ...additionalProps,
      ...externalForwardedProps,
      ...externalSlotProps,
    };
    if (joinedClasses2.length > 0) {
      props2.className = joinedClasses2;
    }
    if (Object.keys(mergedStyle2).length > 0) {
      props2.style = mergedStyle2;
    }
    return {
      props: props2,
      internalRef: void 0,
    };
  }
  const eventHandlers = extractEventHandlers_default({
    ...externalForwardedProps,
    ...externalSlotProps,
  });
  const componentsPropsWithoutEventHandlers = omitEventHandlers_default(externalSlotProps);
  const otherPropsWithoutEventHandlers = omitEventHandlers_default(externalForwardedProps);
  const internalSlotProps = getSlotProps(eventHandlers);
  const joinedClasses = clsx_default(
    internalSlotProps == null ? void 0 : internalSlotProps.className,
    additionalProps == null ? void 0 : additionalProps.className,
    className,
    externalForwardedProps == null ? void 0 : externalForwardedProps.className,
    externalSlotProps == null ? void 0 : externalSlotProps.className
  );
  const mergedStyle = {
    ...(internalSlotProps == null ? void 0 : internalSlotProps.style),
    ...(additionalProps == null ? void 0 : additionalProps.style),
    ...(externalForwardedProps == null ? void 0 : externalForwardedProps.style),
    ...(externalSlotProps == null ? void 0 : externalSlotProps.style),
  };
  const props = {
    ...internalSlotProps,
    ...additionalProps,
    ...otherPropsWithoutEventHandlers,
    ...componentsPropsWithoutEventHandlers,
  };
  if (joinedClasses.length > 0) {
    props.className = joinedClasses;
  }
  if (Object.keys(mergedStyle).length > 0) {
    props.style = mergedStyle;
  }
  return {
    props,
    internalRef: internalSlotProps.ref,
  };
}
var mergeSlotProps_default = mergeSlotProps;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/resolveComponentProps/resolveComponentProps.js
function resolveComponentProps(componentProps, ownerState, slotState) {
  if (typeof componentProps === 'function') {
    return componentProps(ownerState, slotState);
  }
  return componentProps;
}
var resolveComponentProps_default = resolveComponentProps;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/useSlotProps/useSlotProps.js
function useSlotProps(parameters) {
  var _a;
  const {
    elementType,
    externalSlotProps,
    ownerState,
    skipResolvingSlotProps = false,
    ...other
  } = parameters;
  const resolvedComponentsProps = skipResolvingSlotProps
    ? {}
    : resolveComponentProps_default(externalSlotProps, ownerState);
  const { props: mergedProps, internalRef } = mergeSlotProps_default({
    ...other,
    externalSlotProps: resolvedComponentsProps,
  });
  const ref = useForkRef(
    internalRef,
    resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref,
    (_a = parameters.additionalProps) == null ? void 0 : _a.ref
  );
  const props = appendOwnerState_default(
    elementType,
    {
      ...mergedProps,
      ref,
    },
    ownerState
  );
  return props;
}
var useSlotProps_default = useSlotProps;

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/getReactNodeRef/getReactNodeRef.js
var React14 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/node_modules/@mui/utils/esm/getReactElementRef/getReactElementRef.js
var React15 = __toESM(require_react(), 1);

// node_modules/@mui/x-date-pickers/DatePicker/datePickerToolbarClasses.js
function getDatePickerToolbarUtilityClass(slot) {
  return generateUtilityClass('MuiDatePickerToolbar', slot);
}
var datePickerToolbarClasses = generateUtilityClasses('MuiDatePickerToolbar', ['root', 'title']);

// node_modules/@mui/x-date-pickers/DatePicker/DatePickerToolbar.js
var React18 = __toESM(require_react());
var import_prop_types4 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/internals/components/PickersToolbar.js
var React16 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/components/pickersToolbarClasses.js
function getPickersToolbarUtilityClass(slot) {
  return generateUtilityClass('MuiPickersToolbar', slot);
}
var pickersToolbarClasses = generateUtilityClasses('MuiPickersToolbar', ['root', 'content']);

// node_modules/@mui/x-date-pickers/internals/components/PickersToolbar.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = [
  'children',
  'className',
  'toolbarTitle',
  'hidden',
  'titleId',
  'isLandscape',
  'classes',
  'landscapeDirection',
];
var useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    content: ['content'],
  };
  return composeClasses(slots, getPickersToolbarUtilityClass, classes);
};
var PickersToolbarRoot = styled_default('div', {
  name: 'MuiPickersToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  variants: [
    {
      props: {
        isLandscape: true,
      },
      style: {
        height: 'auto',
        maxWidth: 160,
        padding: 16,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
      },
    },
  ],
}));
var PickersToolbarContent = styled_default('div', {
  name: 'MuiPickersToolbar',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  variants: [
    {
      props: {
        isLandscape: true,
      },
      style: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
    {
      props: {
        isLandscape: true,
        landscapeDirection: 'row',
      },
      style: {
        flexDirection: 'row',
      },
    },
  ],
});
var PickersToolbar = React16.forwardRef(function PickersToolbar2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersToolbar',
  });
  const { children, className, toolbarTitle, hidden, titleId } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  if (hidden) {
    return null;
  }
  return (0, import_jsx_runtime.jsxs)(
    PickersToolbarRoot,
    _extends(
      {
        ref,
        className: clsx_default(classes.root, className),
        ownerState,
      },
      other,
      {
        children: [
          (0, import_jsx_runtime.jsx)(Typography_default, {
            color: 'text.secondary',
            variant: 'overline',
            id: titleId,
            children: toolbarTitle,
          }),
          (0, import_jsx_runtime.jsx)(PickersToolbarContent, {
            className: classes.content,
            ownerState,
            children,
          }),
        ],
      }
    )
  );
});

// node_modules/@mui/x-date-pickers/internals/hooks/useUtils.js
var React17 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/locales/utils/getPickersLocalization.js
var getPickersLocalization = (pickersTranslations) => {
  return {
    components: {
      MuiLocalizationProvider: {
        defaultProps: {
          localeText: _extends({}, pickersTranslations),
        },
      },
    },
  };
};
var buildGetOpenDialogAriaText = (params) => {
  const { utils, formatKey, contextTranslation, propsTranslation } = params;
  return (value) => {
    const formattedValue =
      value !== null && utils.isValid(value) ? utils.format(value, formatKey) : null;
    const translation = propsTranslation ?? contextTranslation;
    return translation(value, utils, formattedValue);
  };
};

// node_modules/@mui/x-date-pickers/locales/enUS.js
var enUSPickers = {
  // Calendar navigation
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  // View navigation
  openPreviousView: 'Open previous view',
  openNextView: 'Open next view',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'year view is open, switch to calendar view'
      : 'calendar view is open, switch to year view',
  // DateRange labels
  start: 'Start',
  end: 'End',
  startDate: 'Start date',
  startTime: 'Start time',
  endDate: 'End date',
  endTime: 'End time',
  // Action bar
  cancelButtonLabel: 'Cancel',
  clearButtonLabel: 'Clear',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Today',
  // Toolbar titles
  datePickerToolbarTitle: 'Select date',
  dateTimePickerToolbarTitle: 'Select date & time',
  timePickerToolbarTitle: 'Select time',
  dateRangePickerToolbarTitle: 'Select date range',
  // Clock labels
  clockLabelText: (view, time, utils, formattedTime) =>
    `Select ${view}. ${!formattedTime && (time === null || !utils.isValid(time)) ? 'No time selected' : `Selected time is ${formattedTime ?? utils.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} hours`,
  minutesClockNumberText: (minutes) => `${minutes} minutes`,
  secondsClockNumberText: (seconds) => `${seconds} seconds`,
  // Digital clock labels
  selectViewText: (view) => `Select ${view}`,
  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Week number',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Week ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,
  // Open picker labels
  openDatePickerDialogue: (value, utils, formattedDate) =>
    formattedDate || (value !== null && utils.isValid(value))
      ? `Choose date, selected date is ${formattedDate ?? utils.format(value, 'fullDate')}`
      : 'Choose date',
  openTimePickerDialogue: (value, utils, formattedTime) =>
    formattedTime || (value !== null && utils.isValid(value))
      ? `Choose time, selected time is ${formattedTime ?? utils.format(value, 'fullTime')}`
      : 'Choose time',
  fieldClearLabel: 'Clear',
  // Table labels
  timeTableLabel: 'pick time',
  dateTableLabel: 'pick date',
  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
  // View names
  year: 'Year',
  month: 'Month',
  day: 'Day',
  weekDay: 'Week day',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  meridiem: 'Meridiem',
  // Common
  empty: 'Empty',
};
var DEFAULT_LOCALE = enUSPickers;
var enUS = getPickersLocalization(enUSPickers);

// node_modules/@mui/x-date-pickers/internals/hooks/useUtils.js
var useLocalizationContext = () => {
  const localization = React17.useContext(MuiPickersAdapterContext);
  if (localization === null) {
    throw new Error(
      [
        'MUI X: Can not find the date and time pickers localization context.',
        'It looks like you forgot to wrap your component in LocalizationProvider.',
        'This can also happen if you are bundling multiple versions of the `@mui/x-date-pickers` package',
      ].join('\n')
    );
  }
  if (localization.utils === null) {
    throw new Error(
      [
        'MUI X: Can not find the date and time pickers adapter from its localization context.',
        'It looks like you forgot to pass a `dateAdapter` to your LocalizationProvider.',
      ].join('\n')
    );
  }
  const localeText = React17.useMemo(
    () => _extends({}, DEFAULT_LOCALE, localization.localeText),
    [localization.localeText]
  );
  return React17.useMemo(
    () =>
      _extends({}, localization, {
        localeText,
      }),
    [localization, localeText]
  );
};
var useUtils = () => useLocalizationContext().utils;
var useDefaultDates = () => useLocalizationContext().defaultDates;
var useNow = (timezone) => {
  const utils = useUtils();
  const now = React17.useRef(void 0);
  if (now.current === void 0) {
    now.current = utils.date(void 0, timezone);
  }
  return now.current;
};

// node_modules/@mui/x-date-pickers/hooks/usePickersTranslations.js
var usePickersTranslations = () => useLocalizationContext().localeText;

// node_modules/@mui/x-date-pickers/internals/utils/views.js
var areViewsEqual = (views, expectedViews) => {
  if (views.length !== expectedViews.length) {
    return false;
  }
  return expectedViews.every((expectedView) => views.includes(expectedView));
};
var applyDefaultViewProps = ({ openTo, defaultOpenTo, views, defaultViews }) => {
  const viewsWithDefault = views ?? defaultViews;
  let openToWithDefault;
  if (openTo != null) {
    openToWithDefault = openTo;
  } else if (viewsWithDefault.includes(defaultOpenTo)) {
    openToWithDefault = defaultOpenTo;
  } else if (viewsWithDefault.length > 0) {
    openToWithDefault = viewsWithDefault[0];
  } else {
    throw new Error('MUI X: The `views` prop must contain at least one view.');
  }
  return {
    views: viewsWithDefault,
    openTo: openToWithDefault,
  };
};

// node_modules/@mui/x-date-pickers/internals/utils/date-utils.js
var mergeDateAndTime = (utils, dateParam, timeParam) => {
  let mergedDate = dateParam;
  mergedDate = utils.setHours(mergedDate, utils.getHours(timeParam));
  mergedDate = utils.setMinutes(mergedDate, utils.getMinutes(timeParam));
  mergedDate = utils.setSeconds(mergedDate, utils.getSeconds(timeParam));
  mergedDate = utils.setMilliseconds(mergedDate, utils.getMilliseconds(timeParam));
  return mergedDate;
};
var findClosestEnabledDate = ({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  isDateDisabled,
  utils,
  timezone,
}) => {
  const today = mergeDateAndTime(utils, utils.date(void 0, timezone), date);
  if (disablePast && utils.isBefore(minDate, today)) {
    minDate = today;
  }
  if (disableFuture && utils.isAfter(maxDate, today)) {
    maxDate = today;
  }
  let forward = date;
  let backward = date;
  if (utils.isBefore(date, minDate)) {
    forward = minDate;
    backward = null;
  }
  if (utils.isAfter(date, maxDate)) {
    if (backward) {
      backward = maxDate;
    }
    forward = null;
  }
  while (forward || backward) {
    if (forward && utils.isAfter(forward, maxDate)) {
      forward = null;
    }
    if (backward && utils.isBefore(backward, minDate)) {
      backward = null;
    }
    if (forward) {
      if (!isDateDisabled(forward)) {
        return forward;
      }
      forward = utils.addDays(forward, 1);
    }
    if (backward) {
      if (!isDateDisabled(backward)) {
        return backward;
      }
      backward = utils.addDays(backward, -1);
    }
  }
  return null;
};
var replaceInvalidDateByNull = (utils, value) =>
  value == null || !utils.isValid(value) ? null : value;
var applyDefaultDate = (utils, value, defaultValue) => {
  if (value == null || !utils.isValid(value)) {
    return defaultValue;
  }
  return value;
};
var areDatesEqual = (utils, a, b) => {
  if (!utils.isValid(a) && a != null && !utils.isValid(b) && b != null) {
    return true;
  }
  return utils.isEqual(a, b);
};
var getMonthsInYear = (utils, year) => {
  const firstMonth = utils.startOfYear(year);
  const months = [firstMonth];
  while (months.length < 12) {
    const prevMonth = months[months.length - 1];
    months.push(utils.addMonths(prevMonth, 1));
  }
  return months;
};
var getTodayDate = (utils, timezone, valueType) =>
  valueType === 'date'
    ? utils.startOfDay(utils.date(void 0, timezone))
    : utils.date(void 0, timezone);
var dateViews = ['year', 'month', 'day'];
var isDatePickerView = (view) => dateViews.includes(view);
var resolveDateFormat = (utils, { format, views }, isInToolbar) => {
  if (format != null) {
    return format;
  }
  const formats = utils.formats;
  if (areViewsEqual(views, ['year'])) {
    return formats.year;
  }
  if (areViewsEqual(views, ['month'])) {
    return formats.month;
  }
  if (areViewsEqual(views, ['day'])) {
    return formats.dayOfMonth;
  }
  if (areViewsEqual(views, ['month', 'year'])) {
    return `${formats.month} ${formats.year}`;
  }
  if (areViewsEqual(views, ['day', 'month'])) {
    return `${formats.month} ${formats.dayOfMonth}`;
  }
  if (isInToolbar) {
    return /en/.test(utils.getCurrentLocaleCode())
      ? formats.normalDateWithWeekday
      : formats.normalDate;
  }
  return formats.keyboardDate;
};
var getWeekdays = (utils, date) => {
  const start = utils.startOfWeek(date);
  return [0, 1, 2, 3, 4, 5, 6].map((diff) => utils.addDays(start, diff));
};

// node_modules/@mui/x-date-pickers/DatePicker/DatePickerToolbar.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var _excluded2 = [
  'value',
  'isLandscape',
  'onChange',
  'toolbarFormat',
  'toolbarPlaceholder',
  'views',
  'className',
  'onViewChange',
  'view',
];
var useUtilityClasses2 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    title: ['title'],
  };
  return composeClasses(slots, getDatePickerToolbarUtilityClass, classes);
};
var DatePickerToolbarRoot = styled_default(PickersToolbar, {
  name: 'MuiDatePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});
var DatePickerToolbarTitle = styled_default(Typography_default, {
  name: 'MuiDatePickerToolbar',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})({
  variants: [
    {
      props: {
        isLandscape: true,
      },
      style: {
        margin: 'auto 16px auto auto',
      },
    },
  ],
});
var DatePickerToolbar = React18.forwardRef(function DatePickerToolbar2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDatePickerToolbar',
  });
  const { value, isLandscape, toolbarFormat, toolbarPlaceholder = '––', views, className } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded2);
  const utils = useUtils();
  const translations = usePickersTranslations();
  const classes = useUtilityClasses2(props);
  const dateText = React18.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }
    const formatFromViews = resolveDateFormat(
      utils,
      {
        format: toolbarFormat,
        views,
      },
      true
    );
    return utils.formatByString(value, formatFromViews);
  }, [value, toolbarFormat, toolbarPlaceholder, utils, views]);
  const ownerState = props;
  return (0, import_jsx_runtime2.jsx)(
    DatePickerToolbarRoot,
    _extends(
      {
        ref,
        toolbarTitle: translations.datePickerToolbarTitle,
        isLandscape,
        className: clsx_default(classes.root, className),
      },
      other,
      {
        children: (0, import_jsx_runtime2.jsx)(DatePickerToolbarTitle, {
          variant: 'h4',
          align: isLandscape ? 'left' : 'center',
          ownerState,
          className: classes.title,
          children: dateText,
        }),
      }
    )
  );
});
true
  ? (DatePickerToolbar.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types4.default.object,
      className: import_prop_types4.default.string,
      disabled: import_prop_types4.default.bool,
      /**
       * If `true`, show the toolbar even in desktop mode.
       * @default `true` for Desktop, `false` for Mobile.
       */
      hidden: import_prop_types4.default.bool,
      isLandscape: import_prop_types4.default.bool.isRequired,
      onChange: import_prop_types4.default.func.isRequired,
      /**
       * Callback called when a toolbar is clicked
       * @template TView
       * @param {TView} view The view to open
       */
      onViewChange: import_prop_types4.default.func.isRequired,
      readOnly: import_prop_types4.default.bool,
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
      titleId: import_prop_types4.default.string,
      /**
       * Toolbar date format.
       */
      toolbarFormat: import_prop_types4.default.string,
      /**
       * Toolbar value placeholder—it is displayed when the value is empty.
       * @default "––"
       */
      toolbarPlaceholder: import_prop_types4.default.node,
      value: import_prop_types4.default.object,
      /**
       * Currently visible picker view.
       */
      view: import_prop_types4.default.oneOf(['day', 'month', 'year']).isRequired,
      /**
       * Available views.
       */
      views: import_prop_types4.default.arrayOf(
        import_prop_types4.default.oneOf(['day', 'month', 'year']).isRequired
      ).isRequired,
    })
  : void 0;

// node_modules/@mui/x-date-pickers/internals/utils/time-utils.js
var timeViews = ['hours', 'minutes', 'seconds'];
var isTimeView = (view) => timeViews.includes(view);
var getSecondsInDay = (date, utils) => {
  return utils.getHours(date) * 3600 + utils.getMinutes(date) * 60 + utils.getSeconds(date);
};
var createIsAfterIgnoreDatePart =
  (disableIgnoringDatePartForTimeValidation, utils) => (dateLeft, dateRight) => {
    if (disableIgnoringDatePartForTimeValidation) {
      return utils.isAfter(dateLeft, dateRight);
    }
    return getSecondsInDay(dateLeft, utils) > getSecondsInDay(dateRight, utils);
  };

// node_modules/@mui/x-date-pickers/internals/utils/getDefaultReferenceDate.js
var SECTION_TYPE_GRANULARITY = {
  year: 1,
  month: 2,
  day: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
  milliseconds: 7,
};
var getSectionTypeGranularity = (sections) =>
  Math.max(...sections.map((section) => SECTION_TYPE_GRANULARITY[section.type] ?? 1));
var roundDate = (utils, granularity, date) => {
  if (granularity === SECTION_TYPE_GRANULARITY.year) {
    return utils.startOfYear(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.month) {
    return utils.startOfMonth(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.day) {
    return utils.startOfDay(date);
  }
  let roundedDate = date;
  if (granularity < SECTION_TYPE_GRANULARITY.minutes) {
    roundedDate = utils.setMinutes(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.seconds) {
    roundedDate = utils.setSeconds(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.milliseconds) {
    roundedDate = utils.setMilliseconds(roundedDate, 0);
  }
  return roundedDate;
};
var getDefaultReferenceDate = ({
  props,
  utils,
  granularity,
  timezone,
  getTodayDate: inGetTodayDate,
}) => {
  let referenceDate = inGetTodayDate
    ? inGetTodayDate()
    : roundDate(utils, granularity, getTodayDate(utils, timezone));
  if (props.minDate != null && utils.isAfterDay(props.minDate, referenceDate)) {
    referenceDate = roundDate(utils, granularity, props.minDate);
  }
  if (props.maxDate != null && utils.isBeforeDay(props.maxDate, referenceDate)) {
    referenceDate = roundDate(utils, granularity, props.maxDate);
  }
  const isAfter = createIsAfterIgnoreDatePart(
    props.disableIgnoringDatePartForTimeValidation ?? false,
    utils
  );
  if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
    referenceDate = roundDate(
      utils,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.minTime
        : mergeDateAndTime(utils, referenceDate, props.minTime)
    );
  }
  if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
    referenceDate = roundDate(
      utils,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.maxTime
        : mergeDateAndTime(utils, referenceDate, props.maxTime)
    );
  }
  return referenceDate;
};

// node_modules/@mui/x-date-pickers/internals/hooks/useField/useField.utils.js
var getDateSectionConfigFromFormatToken = (utils, formatToken) => {
  const config = utils.formatTokenMap[formatToken];
  if (config == null) {
    throw new Error(
      [
        `MUI X: The token "${formatToken}" is not supported by the Date and Time Pickers.`,
        'Please try using another token or open an issue on https://github.com/mui/mui-x/issues/new/choose if you think it should be supported.',
      ].join('\n')
    );
  }
  if (typeof config === 'string') {
    return {
      type: config,
      contentType: config === 'meridiem' ? 'letter' : 'digit',
      maxLength: void 0,
    };
  }
  return {
    type: config.sectionType,
    contentType: config.contentType,
    maxLength: config.maxLength,
  };
};
var getDeltaFromKeyCode = (keyCode) => {
  switch (keyCode) {
    case 'ArrowUp':
      return 1;
    case 'ArrowDown':
      return -1;
    case 'PageUp':
      return 5;
    case 'PageDown':
      return -5;
    default:
      return 0;
  }
};
var getDaysInWeekStr = (utils, format) => {
  const elements = [];
  const now = utils.date(void 0, 'default');
  const startDate = utils.startOfWeek(now);
  const endDate = utils.endOfWeek(now);
  let current = startDate;
  while (utils.isBefore(current, endDate)) {
    elements.push(current);
    current = utils.addDays(current, 1);
  }
  return elements.map((weekDay) => utils.formatByString(weekDay, format));
};
var getLetterEditingOptions = (utils, timezone, sectionType, format) => {
  switch (sectionType) {
    case 'month': {
      return getMonthsInYear(utils, utils.date(void 0, timezone)).map((month) =>
        utils.formatByString(month, format)
      );
    }
    case 'weekDay': {
      return getDaysInWeekStr(utils, format);
    }
    case 'meridiem': {
      const now = utils.date(void 0, timezone);
      return [utils.startOfDay(now), utils.endOfDay(now)].map((date) =>
        utils.formatByString(date, format)
      );
    }
    default: {
      return [];
    }
  }
};
var FORMAT_SECONDS_NO_LEADING_ZEROS = 's';
var NON_LOCALIZED_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var getLocalizedDigits = (utils) => {
  const today = utils.date(void 0);
  const formattedZero = utils.formatByString(
    utils.setSeconds(today, 0),
    FORMAT_SECONDS_NO_LEADING_ZEROS
  );
  if (formattedZero === '0') {
    return NON_LOCALIZED_DIGITS;
  }
  return Array.from({
    length: 10,
  }).map((_, index) =>
    utils.formatByString(utils.setSeconds(today, index), FORMAT_SECONDS_NO_LEADING_ZEROS)
  );
};
var removeLocalizedDigits = (valueStr, localizedDigits) => {
  if (localizedDigits[0] === '0') {
    return valueStr;
  }
  const digits = [];
  let currentFormattedDigit = '';
  for (let i = 0; i < valueStr.length; i += 1) {
    currentFormattedDigit += valueStr[i];
    const matchingDigitIndex = localizedDigits.indexOf(currentFormattedDigit);
    if (matchingDigitIndex > -1) {
      digits.push(matchingDigitIndex.toString());
      currentFormattedDigit = '';
    }
  }
  return digits.join('');
};
var applyLocalizedDigits = (valueStr, localizedDigits) => {
  if (localizedDigits[0] === '0') {
    return valueStr;
  }
  return valueStr
    .split('')
    .map((char) => localizedDigits[Number(char)])
    .join('');
};
var isStringNumber = (valueStr, localizedDigits) => {
  const nonLocalizedValueStr = removeLocalizedDigits(valueStr, localizedDigits);
  return nonLocalizedValueStr !== ' ' && !Number.isNaN(Number(nonLocalizedValueStr));
};
var cleanLeadingZeros = (valueStr, size) => {
  let cleanValueStr = valueStr;
  cleanValueStr = Number(cleanValueStr).toString();
  while (cleanValueStr.length < size) {
    cleanValueStr = `0${cleanValueStr}`;
  }
  return cleanValueStr;
};
var cleanDigitSectionValue = (utils, value, sectionBoundaries, localizedDigits, section) => {
  if (true) {
    if (section.type !== 'day' && section.contentType === 'digit-with-letter') {
      throw new Error(
        [
          `MUI X: The token "${section.format}" is a digit format with letter in it.'
             This type of format is only supported for 'day' sections`,
        ].join('\n')
      );
    }
  }
  if (section.type === 'day' && section.contentType === 'digit-with-letter') {
    const date = utils.setDate(sectionBoundaries.longestMonth, value);
    return utils.formatByString(date, section.format);
  }
  let valueStr = value.toString();
  if (section.hasLeadingZerosInInput) {
    valueStr = cleanLeadingZeros(valueStr, section.maxLength);
  }
  return applyLocalizedDigits(valueStr, localizedDigits);
};
var adjustSectionValue = (
  utils,
  timezone,
  section,
  keyCode,
  sectionsValueBoundaries,
  localizedDigits,
  activeDate,
  stepsAttributes
) => {
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';
  const shouldSetAbsolute = section.value === '' || isStart || isEnd;
  const adjustDigitSection = () => {
    const sectionBoundaries = sectionsValueBoundaries[section.type]({
      currentDate: activeDate,
      format: section.format,
      contentType: section.contentType,
    });
    const getCleanValue = (value) =>
      cleanDigitSectionValue(utils, value, sectionBoundaries, localizedDigits, section);
    const step =
      section.type === 'minutes' && (stepsAttributes == null ? void 0 : stepsAttributes.minutesStep)
        ? stepsAttributes.minutesStep
        : 1;
    let newSectionValueNumber;
    if (shouldSetAbsolute) {
      if (section.type === 'year' && !isEnd && !isStart) {
        return utils.formatByString(utils.date(void 0, timezone), section.format);
      }
      if (delta > 0 || isStart) {
        newSectionValueNumber = sectionBoundaries.minimum;
      } else {
        newSectionValueNumber = sectionBoundaries.maximum;
      }
    } else {
      const currentSectionValue = parseInt(
        removeLocalizedDigits(section.value, localizedDigits),
        10
      );
      newSectionValueNumber = currentSectionValue + delta * step;
    }
    if (newSectionValueNumber % step !== 0) {
      if (delta < 0 || isStart) {
        newSectionValueNumber += step - ((step + newSectionValueNumber) % step);
      }
      if (delta > 0 || isEnd) {
        newSectionValueNumber -= newSectionValueNumber % step;
      }
    }
    if (newSectionValueNumber > sectionBoundaries.maximum) {
      return getCleanValue(
        sectionBoundaries.minimum +
          ((newSectionValueNumber - sectionBoundaries.maximum - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1))
      );
    }
    if (newSectionValueNumber < sectionBoundaries.minimum) {
      return getCleanValue(
        sectionBoundaries.maximum -
          ((sectionBoundaries.minimum - newSectionValueNumber - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1))
      );
    }
    return getCleanValue(newSectionValueNumber);
  };
  const adjustLetterSection = () => {
    const options = getLetterEditingOptions(utils, timezone, section.type, section.format);
    if (options.length === 0) {
      return section.value;
    }
    if (shouldSetAbsolute) {
      if (delta > 0 || isStart) {
        return options[0];
      }
      return options[options.length - 1];
    }
    const currentOptionIndex = options.indexOf(section.value);
    const newOptionIndex = (currentOptionIndex + delta) % options.length;
    const clampedIndex = (newOptionIndex + options.length) % options.length;
    return options[clampedIndex];
  };
  if (section.contentType === 'digit' || section.contentType === 'digit-with-letter') {
    return adjustDigitSection();
  }
  return adjustLetterSection();
};
var getSectionVisibleValue = (section, target, localizedDigits) => {
  let value = section.value || section.placeholder;
  const hasLeadingZeros =
    target === 'non-input' ? section.hasLeadingZerosInFormat : section.hasLeadingZerosInInput;
  if (
    target === 'non-input' &&
    section.hasLeadingZerosInInput &&
    !section.hasLeadingZerosInFormat
  ) {
    value = Number(removeLocalizedDigits(value, localizedDigits)).toString();
  }
  const shouldAddInvisibleSpace =
    ['input-rtl', 'input-ltr'].includes(target) &&
    section.contentType === 'digit' &&
    !hasLeadingZeros &&
    value.length === 1;
  if (shouldAddInvisibleSpace) {
    value = `${value}‎`;
  }
  if (target === 'input-rtl') {
    value = `⁨${value}⁩`;
  }
  return value;
};
var changeSectionValueFormat = (utils, valueStr, currentFormat, newFormat) => {
  if (true) {
    if (getDateSectionConfigFromFormatToken(utils, currentFormat).type === 'weekDay') {
      throw new Error("changeSectionValueFormat doesn't support week day formats");
    }
  }
  return utils.formatByString(utils.parse(valueStr, currentFormat), newFormat);
};
var isFourDigitYearFormat = (utils, format) =>
  utils.formatByString(utils.date(void 0, 'system'), format).length === 4;
var doesSectionFormatHaveLeadingZeros = (utils, contentType, sectionType, format) => {
  if (contentType !== 'digit') {
    return false;
  }
  const now = utils.date(void 0, 'default');
  switch (sectionType) {
    case 'year': {
      if (utils.lib === 'dayjs' && format === 'YY') {
        return true;
      }
      return utils.formatByString(utils.setYear(now, 1), format).startsWith('0');
    }
    case 'month': {
      return utils.formatByString(utils.startOfYear(now), format).length > 1;
    }
    case 'day': {
      return utils.formatByString(utils.startOfMonth(now), format).length > 1;
    }
    case 'weekDay': {
      return utils.formatByString(utils.startOfWeek(now), format).length > 1;
    }
    case 'hours': {
      return utils.formatByString(utils.setHours(now, 1), format).length > 1;
    }
    case 'minutes': {
      return utils.formatByString(utils.setMinutes(now, 1), format).length > 1;
    }
    case 'seconds': {
      return utils.formatByString(utils.setSeconds(now, 1), format).length > 1;
    }
    default: {
      throw new Error('Invalid section type');
    }
  }
};
var getDateFromDateSections = (utils, sections, localizedDigits) => {
  const shouldSkipWeekDays = sections.some((section) => section.type === 'day');
  const sectionFormats = [];
  const sectionValues = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const shouldSkip = shouldSkipWeekDays && section.type === 'weekDay';
    if (!shouldSkip) {
      sectionFormats.push(section.format);
      sectionValues.push(getSectionVisibleValue(section, 'non-input', localizedDigits));
    }
  }
  const formatWithoutSeparator = sectionFormats.join(' ');
  const dateWithoutSeparatorStr = sectionValues.join(' ');
  return utils.parse(dateWithoutSeparatorStr, formatWithoutSeparator);
};
var createDateStrForV7HiddenInputFromSections = (sections) =>
  sections
    .map((section) => {
      return `${section.startSeparator}${section.value || section.placeholder}${section.endSeparator}`;
    })
    .join('');
var createDateStrForV6InputFromSections = (sections, localizedDigits, isRtl) => {
  const formattedSections = sections.map((section) => {
    const dateValue = getSectionVisibleValue(
      section,
      isRtl ? 'input-rtl' : 'input-ltr',
      localizedDigits
    );
    return `${section.startSeparator}${dateValue}${section.endSeparator}`;
  });
  const dateStr = formattedSections.join('');
  if (!isRtl) {
    return dateStr;
  }
  return `⁦${dateStr}⁩`;
};
var getSectionsBoundaries = (utils, localizedDigits, timezone) => {
  const today = utils.date(void 0, timezone);
  const endOfYear = utils.endOfYear(today);
  const endOfDay = utils.endOfDay(today);
  const { maxDaysInMonth, longestMonth } = getMonthsInYear(utils, today).reduce(
    (acc, month) => {
      const daysInMonth = utils.getDaysInMonth(month);
      if (daysInMonth > acc.maxDaysInMonth) {
        return {
          maxDaysInMonth: daysInMonth,
          longestMonth: month,
        };
      }
      return acc;
    },
    {
      maxDaysInMonth: 0,
      longestMonth: null,
    }
  );
  return {
    year: ({ format }) => ({
      minimum: 0,
      maximum: isFourDigitYearFormat(utils, format) ? 9999 : 99,
    }),
    month: () => ({
      minimum: 1,
      // Assumption: All years have the same amount of months
      maximum: utils.getMonth(endOfYear) + 1,
    }),
    day: ({ currentDate }) => ({
      minimum: 1,
      maximum:
        currentDate != null && utils.isValid(currentDate)
          ? utils.getDaysInMonth(currentDate)
          : maxDaysInMonth,
      longestMonth,
    }),
    weekDay: ({ format, contentType }) => {
      if (contentType === 'digit') {
        const daysInWeek = getDaysInWeekStr(utils, format).map(Number);
        return {
          minimum: Math.min(...daysInWeek),
          maximum: Math.max(...daysInWeek),
        };
      }
      return {
        minimum: 1,
        maximum: 7,
      };
    },
    hours: ({ format }) => {
      const lastHourInDay = utils.getHours(endOfDay);
      const hasMeridiem =
        removeLocalizedDigits(
          utils.formatByString(utils.endOfDay(today), format),
          localizedDigits
        ) !== lastHourInDay.toString();
      if (hasMeridiem) {
        return {
          minimum: 1,
          maximum: Number(
            removeLocalizedDigits(
              utils.formatByString(utils.startOfDay(today), format),
              localizedDigits
            )
          ),
        };
      }
      return {
        minimum: 0,
        maximum: lastHourInDay,
      };
    },
    minutes: () => ({
      minimum: 0,
      // Assumption: All years have the same amount of minutes
      maximum: utils.getMinutes(endOfDay),
    }),
    seconds: () => ({
      minimum: 0,
      // Assumption: All years have the same amount of seconds
      maximum: utils.getSeconds(endOfDay),
    }),
    meridiem: () => ({
      minimum: 0,
      maximum: 1,
    }),
    empty: () => ({
      minimum: 0,
      maximum: 0,
    }),
  };
};
var warnedOnceInvalidSection = false;
var validateSections = (sections, valueType) => {
  if (true) {
    if (!warnedOnceInvalidSection) {
      const supportedSections = ['empty'];
      if (['date', 'date-time'].includes(valueType)) {
        supportedSections.push('weekDay', 'day', 'month', 'year');
      }
      if (['time', 'date-time'].includes(valueType)) {
        supportedSections.push('hours', 'minutes', 'seconds', 'meridiem');
      }
      const invalidSection = sections.find((section) => !supportedSections.includes(section.type));
      if (invalidSection) {
        console.warn(
          `MUI X: The field component you are using is not compatible with the "${invalidSection.type}" date section.`,
          `The supported date sections are ["${supportedSections.join('", "')}"]\`.`
        );
        warnedOnceInvalidSection = true;
      }
    }
  }
};
var transferDateSectionValue = (utils, section, dateToTransferFrom, dateToTransferTo) => {
  switch (section.type) {
    case 'year': {
      return utils.setYear(dateToTransferTo, utils.getYear(dateToTransferFrom));
    }
    case 'month': {
      return utils.setMonth(dateToTransferTo, utils.getMonth(dateToTransferFrom));
    }
    case 'weekDay': {
      const formattedDaysInWeek = getDaysInWeekStr(utils, section.format);
      const dayInWeekStrOfActiveDate = utils.formatByString(dateToTransferFrom, section.format);
      const dayInWeekOfActiveDate = formattedDaysInWeek.indexOf(dayInWeekStrOfActiveDate);
      const dayInWeekOfNewSectionValue = formattedDaysInWeek.indexOf(section.value);
      const diff = dayInWeekOfNewSectionValue - dayInWeekOfActiveDate;
      return utils.addDays(dateToTransferFrom, diff);
    }
    case 'day': {
      return utils.setDate(dateToTransferTo, utils.getDate(dateToTransferFrom));
    }
    case 'meridiem': {
      const isAM = utils.getHours(dateToTransferFrom) < 12;
      const mergedDateHours = utils.getHours(dateToTransferTo);
      if (isAM && mergedDateHours >= 12) {
        return utils.addHours(dateToTransferTo, -12);
      }
      if (!isAM && mergedDateHours < 12) {
        return utils.addHours(dateToTransferTo, 12);
      }
      return dateToTransferTo;
    }
    case 'hours': {
      return utils.setHours(dateToTransferTo, utils.getHours(dateToTransferFrom));
    }
    case 'minutes': {
      return utils.setMinutes(dateToTransferTo, utils.getMinutes(dateToTransferFrom));
    }
    case 'seconds': {
      return utils.setSeconds(dateToTransferTo, utils.getSeconds(dateToTransferFrom));
    }
    default: {
      return dateToTransferTo;
    }
  }
};
var reliableSectionModificationOrder = {
  year: 1,
  month: 2,
  day: 3,
  weekDay: 4,
  hours: 5,
  minutes: 6,
  seconds: 7,
  meridiem: 8,
  empty: 9,
};
var mergeDateIntoReferenceDate = (
  utils,
  dateToTransferFrom,
  sections,
  referenceDate,
  shouldLimitToEditedSections
) =>
  // cloning sections before sort to avoid mutating it
  [...sections]
    .sort(
      (a, b) => reliableSectionModificationOrder[a.type] - reliableSectionModificationOrder[b.type]
    )
    .reduce((mergedDate, section) => {
      if (!shouldLimitToEditedSections || section.modified) {
        return transferDateSectionValue(utils, section, dateToTransferFrom, mergedDate);
      }
      return mergedDate;
    }, referenceDate);
var isAndroid = () => navigator.userAgent.toLowerCase().includes('android');
var getSectionOrder = (sections, shouldApplyRTL) => {
  const neighbors = {};
  if (!shouldApplyRTL) {
    sections.forEach((_, index) => {
      const leftIndex = index === 0 ? null : index - 1;
      const rightIndex = index === sections.length - 1 ? null : index + 1;
      neighbors[index] = {
        leftIndex,
        rightIndex,
      };
    });
    return {
      neighbors,
      startIndex: 0,
      endIndex: sections.length - 1,
    };
  }
  const rtl2ltr = {};
  const ltr2rtl = {};
  let groupedSectionsStart = 0;
  let groupedSectionsEnd = 0;
  let RTLIndex = sections.length - 1;
  while (RTLIndex >= 0) {
    groupedSectionsEnd = sections.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (section, index) => {
        var _a;
        return (
          index >= groupedSectionsStart &&
          ((_a = section.endSeparator) == null ? void 0 : _a.includes(' ')) && // Special case where the spaces were not there in the initial input
          section.endSeparator !== ' / '
        );
      }
    );
    if (groupedSectionsEnd === -1) {
      groupedSectionsEnd = sections.length - 1;
    }
    for (let i = groupedSectionsEnd; i >= groupedSectionsStart; i -= 1) {
      ltr2rtl[i] = RTLIndex;
      rtl2ltr[RTLIndex] = i;
      RTLIndex -= 1;
    }
    groupedSectionsStart = groupedSectionsEnd + 1;
  }
  sections.forEach((_, index) => {
    const rtlIndex = ltr2rtl[index];
    const leftIndex = rtlIndex === 0 ? null : rtl2ltr[rtlIndex - 1];
    const rightIndex = rtlIndex === sections.length - 1 ? null : rtl2ltr[rtlIndex + 1];
    neighbors[index] = {
      leftIndex,
      rightIndex,
    };
  });
  return {
    neighbors,
    startIndex: rtl2ltr[0],
    endIndex: rtl2ltr[sections.length - 1],
  };
};
var parseSelectedSections = (selectedSections, sections) => {
  if (selectedSections == null) {
    return null;
  }
  if (selectedSections === 'all') {
    return 'all';
  }
  if (typeof selectedSections === 'string') {
    const index = sections.findIndex((section) => section.type === selectedSections);
    return index === -1 ? null : index;
  }
  return selectedSections;
};
var getSectionValueText = (section, utils) => {
  if (!section.value) {
    return void 0;
  }
  switch (section.type) {
    case 'month': {
      if (section.contentType === 'digit') {
        return utils.format(utils.setMonth(utils.date(), Number(section.value) - 1), 'month');
      }
      const parsedDate = utils.parse(section.value, section.format);
      return parsedDate ? utils.format(parsedDate, 'month') : void 0;
    }
    case 'day':
      return section.contentType === 'digit'
        ? utils.format(
            utils.setDate(utils.startOfYear(utils.date()), Number(section.value)),
            'dayOfMonthFull'
          )
        : section.value;
    case 'weekDay':
      return void 0;
    default:
      return void 0;
  }
};
var getSectionValueNow = (section, utils) => {
  if (!section.value) {
    return void 0;
  }
  switch (section.type) {
    case 'weekDay': {
      if (section.contentType === 'letter') {
        return void 0;
      }
      return Number(section.value);
    }
    case 'meridiem': {
      const parsedDate = utils.parse(
        `01:00 ${section.value}`,
        `${utils.formats.hours12h}:${utils.formats.minutes} ${section.format}`
      );
      if (parsedDate) {
        return utils.getHours(parsedDate) >= 12 ? 1 : 0;
      }
      return void 0;
    }
    case 'day':
      return section.contentType === 'digit-with-letter'
        ? parseInt(section.value, 10)
        : Number(section.value);
    case 'month': {
      if (section.contentType === 'digit') {
        return Number(section.value);
      }
      const parsedDate = utils.parse(section.value, section.format);
      return parsedDate ? utils.getMonth(parsedDate) + 1 : void 0;
    }
    default:
      return section.contentType !== 'letter' ? Number(section.value) : void 0;
  }
};

// node_modules/@mui/x-date-pickers/internals/utils/valueManagers.js
var _excluded3 = ['value', 'referenceDate'];
var singleItemValueManager = {
  emptyValue: null,
  getTodayValue: getTodayDate,
  getInitialReferenceValue: (_ref) => {
    let { value, referenceDate } = _ref,
      params = _objectWithoutPropertiesLoose(_ref, _excluded3);
    if (value != null && params.utils.isValid(value)) {
      return value;
    }
    if (referenceDate != null) {
      return referenceDate;
    }
    return getDefaultReferenceDate(params);
  },
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: areDatesEqual,
  isSameError: (a, b) => a === b,
  hasError: (error) => error != null,
  defaultErrorState: null,
  getTimezone: (utils, value) =>
    value == null || !utils.isValid(value) ? null : utils.getTimezone(value),
  setTimezone: (utils, timezone, value) =>
    value == null ? null : utils.setTimezone(value, timezone),
};
var singleItemFieldValueManager = {
  updateReferenceValue: (utils, value, prevReferenceValue) =>
    value == null || !utils.isValid(value) ? prevReferenceValue : value,
  getSectionsFromValue: (utils, date, prevSections, getSectionsFromDate) => {
    const shouldReUsePrevDateSections = !utils.isValid(date) && !!prevSections;
    if (shouldReUsePrevDateSections) {
      return prevSections;
    }
    return getSectionsFromDate(date);
  },
  getV7HiddenInputValueFromSections: createDateStrForV7HiddenInputFromSections,
  getV6InputValueFromSections: createDateStrForV6InputFromSections,
  getActiveDateManager: (utils, state) => ({
    date: state.value,
    referenceDate: state.referenceValue,
    getSections: (sections) => sections,
    getNewValuesFromNewActiveDate: (newActiveDate) => ({
      value: newActiveDate,
      referenceValue:
        newActiveDate == null || !utils.isValid(newActiveDate)
          ? state.referenceValue
          : newActiveDate,
    }),
  }),
  parseValueStr: (valueStr, referenceValue, parseDate) =>
    parseDate(valueStr.trim(), referenceValue),
};

// node_modules/@mui/x-date-pickers/DatePicker/shared.js
var React19 = __toESM(require_react());
function useDatePickerDefaultizedProps(props, name) {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const themeProps = useThemeProps({
    props,
    name,
  });
  const localeText = React19.useMemo(() => {
    var _a;
    if (((_a = themeProps.localeText) == null ? void 0 : _a.toolbarTitle) == null) {
      return themeProps.localeText;
    }
    return _extends({}, themeProps.localeText, {
      datePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    });
  }, [themeProps.localeText]);
  return _extends(
    {},
    themeProps,
    {
      localeText,
    },
    applyDefaultViewProps({
      views: themeProps.views,
      openTo: themeProps.openTo,
      defaultViews: ['year', 'day'],
      defaultOpenTo: 'day',
    }),
    {
      disableFuture: themeProps.disableFuture ?? false,
      disablePast: themeProps.disablePast ?? false,
      minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
      slots: _extends(
        {
          toolbar: DatePickerToolbar,
        },
        themeProps.slots
      ),
    }
  );
}

// node_modules/@mui/x-date-pickers/validation/validateDate.js
var validateDate = ({ props, value, timezone, adapter }) => {
  if (value === null) {
    return null;
  }
  const { shouldDisableDate, shouldDisableMonth, shouldDisableYear, disablePast, disableFuture } =
    props;
  const now = adapter.utils.date(void 0, timezone);
  const minDate = applyDefaultDate(adapter.utils, props.minDate, adapter.defaultDates.minDate);
  const maxDate = applyDefaultDate(adapter.utils, props.maxDate, adapter.defaultDates.maxDate);
  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';
    case Boolean(shouldDisableDate && shouldDisableDate(value)):
      return 'shouldDisableDate';
    case Boolean(shouldDisableMonth && shouldDisableMonth(value)):
      return 'shouldDisableMonth';
    case Boolean(shouldDisableYear && shouldDisableYear(value)):
      return 'shouldDisableYear';
    case Boolean(disableFuture && adapter.utils.isAfterDay(value, now)):
      return 'disableFuture';
    case Boolean(disablePast && adapter.utils.isBeforeDay(value, now)):
      return 'disablePast';
    case Boolean(minDate && adapter.utils.isBeforeDay(value, minDate)):
      return 'minDate';
    case Boolean(maxDate && adapter.utils.isAfterDay(value, maxDate)):
      return 'maxDate';
    default:
      return null;
  }
};
validateDate.valueManager = singleItemValueManager;

// node_modules/@mui/x-date-pickers/validation/extractValidationProps.js
var DATE_VALIDATION_PROP_NAMES = [
  'disablePast',
  'disableFuture',
  'minDate',
  'maxDate',
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
];
var TIME_VALIDATION_PROP_NAMES = [
  'disablePast',
  'disableFuture',
  'minTime',
  'maxTime',
  'shouldDisableTime',
  'minutesStep',
  'ampm',
  'disableIgnoringDatePartForTimeValidation',
];
var DATE_TIME_VALIDATION_PROP_NAMES = ['minDateTime', 'maxDateTime'];
var VALIDATION_PROP_NAMES = [
  ...DATE_VALIDATION_PROP_NAMES,
  ...TIME_VALIDATION_PROP_NAMES,
  ...DATE_TIME_VALIDATION_PROP_NAMES,
];
var extractValidationProps = (props) =>
  VALIDATION_PROP_NAMES.reduce((extractedProps, propName) => {
    if (props.hasOwnProperty(propName)) {
      extractedProps[propName] = props[propName];
    }
    return extractedProps;
  }, {});

// node_modules/@mui/x-date-pickers/validation/validateTime.js
var validateTime = ({ adapter, value, timezone, props }) => {
  if (value === null) {
    return null;
  }
  const {
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation = false,
    disablePast,
    disableFuture,
  } = props;
  const now = adapter.utils.date(void 0, timezone);
  const isAfter = createIsAfterIgnoreDatePart(
    disableIgnoringDatePartForTimeValidation,
    adapter.utils
  );
  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';
    case Boolean(minTime && isAfter(minTime, value)):
      return 'minTime';
    case Boolean(maxTime && isAfter(value, maxTime)):
      return 'maxTime';
    case Boolean(disableFuture && adapter.utils.isAfter(value, now)):
      return 'disableFuture';
    case Boolean(disablePast && adapter.utils.isBefore(value, now)):
      return 'disablePast';
    case Boolean(shouldDisableTime && shouldDisableTime(value, 'hours')):
      return 'shouldDisableTime-hours';
    case Boolean(shouldDisableTime && shouldDisableTime(value, 'minutes')):
      return 'shouldDisableTime-minutes';
    case Boolean(shouldDisableTime && shouldDisableTime(value, 'seconds')):
      return 'shouldDisableTime-seconds';
    case Boolean(minutesStep && adapter.utils.getMinutes(value) % minutesStep !== 0):
      return 'minutesStep';
    default:
      return null;
  }
};
validateTime.valueManager = singleItemValueManager;

// node_modules/@mui/x-date-pickers/validation/validateDateTime.js
var validateDateTime = ({ adapter, value, timezone, props }) => {
  const dateValidationResult = validateDate({
    adapter,
    value,
    timezone,
    props,
  });
  if (dateValidationResult !== null) {
    return dateValidationResult;
  }
  return validateTime({
    adapter,
    value,
    timezone,
    props,
  });
};
validateDateTime.valueManager = singleItemValueManager;

// node_modules/@mui/x-date-pickers/validation/useValidation.js
var React20 = __toESM(require_react());
function useValidation(options) {
  const { props, validator: validator2, value, timezone, onError } = options;
  const adapter = useLocalizationContext();
  const previousValidationErrorRef = React20.useRef(validator2.valueManager.defaultErrorState);
  const validationError = validator2({
    adapter,
    value,
    timezone,
    props,
  });
  const hasValidationError = validator2.valueManager.hasError(validationError);
  React20.useEffect(() => {
    if (
      onError &&
      !validator2.valueManager.isSameError(validationError, previousValidationErrorRef.current)
    ) {
      onError(validationError, value);
    }
    previousValidationErrorRef.current = validationError;
  }, [validator2, onError, validationError, value]);
  const getValidationErrorForNewValue = useEventCallback_default((newValue) => {
    return validator2({
      adapter,
      value: newValue,
      timezone,
      props,
    });
  });
  return {
    validationError,
    hasValidationError,
    getValidationErrorForNewValue,
  };
}

// node_modules/@mui/x-date-pickers/internals/utils/utils.js
function arrayIncludes(array, itemOrItems) {
  if (Array.isArray(itemOrItems)) {
    return itemOrItems.every((item) => array.indexOf(item) !== -1);
  }
  return array.indexOf(itemOrItems) !== -1;
}
var onSpaceOrEnter = (innerFn, externalEvent) => (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    innerFn(event);
    event.preventDefault();
    event.stopPropagation();
  }
  if (externalEvent) {
    externalEvent(event);
  }
};
var getActiveElement = (root = document) => {
  const activeEl = root.activeElement;
  if (!activeEl) {
    return null;
  }
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
};
var DEFAULT_DESKTOP_MODE_MEDIA_QUERY = '@media (pointer: fine)';

// node_modules/@mui/x-date-pickers/icons/index.js
var React21 = __toESM(require_react());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var ArrowDropDownIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M7 10l5 5 5-5z',
  }),
  'ArrowDropDown'
);
var ArrowLeftIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z',
  }),
  'ArrowLeft'
);
var ArrowRightIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
  }),
  'ArrowRight'
);
var CalendarIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  }),
  'Calendar'
);
var ClockIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsxs)(React21.Fragment, {
    children: [
      (0, import_jsx_runtime3.jsx)('path', {
        d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
      }),
      (0, import_jsx_runtime3.jsx)('path', {
        d: 'M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z',
      }),
    ],
  }),
  'Clock'
);
var DateRangeIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z',
  }),
  'DateRange'
);
var TimeIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsxs)(React21.Fragment, {
    children: [
      (0, import_jsx_runtime3.jsx)('path', {
        d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
      }),
      (0, import_jsx_runtime3.jsx)('path', {
        d: 'M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z',
      }),
    ],
  }),
  'Time'
);
var ClearIcon = createSvgIcon(
  (0, import_jsx_runtime3.jsx)('path', {
    d: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  }),
  'Clear'
);

// node_modules/@mui/x-date-pickers/dateViewRenderers/dateViewRenderers.js
var React38 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/DateCalendar/DateCalendar.js
var React37 = __toESM(require_react());
var import_prop_types9 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/DateCalendar/useCalendarState.js
var React23 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/DateCalendar/useIsDateDisabled.js
var React22 = __toESM(require_react());
var useIsDateDisabled = ({
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  timezone,
}) => {
  const adapter = useLocalizationContext();
  return React22.useCallback(
    (day) =>
      validateDate({
        adapter,
        value: day,
        timezone,
        props: {
          shouldDisableDate,
          shouldDisableMonth,
          shouldDisableYear,
          minDate,
          maxDate,
          disableFuture,
          disablePast,
        },
      }) !== null,
    [
      adapter,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      timezone,
    ]
  );
};

// node_modules/@mui/x-date-pickers/DateCalendar/useCalendarState.js
var createCalendarStateReducer =
  (reduceAnimations, disableSwitchToMonthOnDayFocus, utils) => (state, action) => {
    switch (action.type) {
      case 'changeMonth':
        return _extends({}, state, {
          slideDirection: action.direction,
          currentMonth: action.newMonth,
          isMonthSwitchingAnimating: !reduceAnimations,
        });
      case 'changeMonthTimezone': {
        const newTimezone = action.newTimezone;
        if (utils.getTimezone(state.currentMonth) === newTimezone) {
          return state;
        }
        let newCurrentMonth = utils.setTimezone(state.currentMonth, newTimezone);
        if (utils.getMonth(newCurrentMonth) !== utils.getMonth(state.currentMonth)) {
          newCurrentMonth = utils.setMonth(newCurrentMonth, utils.getMonth(state.currentMonth));
        }
        return _extends({}, state, {
          currentMonth: newCurrentMonth,
        });
      }
      case 'finishMonthSwitchingAnimation':
        return _extends({}, state, {
          isMonthSwitchingAnimating: false,
        });
      case 'changeFocusedDay': {
        if (
          state.focusedDay != null &&
          action.focusedDay != null &&
          utils.isSameDay(action.focusedDay, state.focusedDay)
        ) {
          return state;
        }
        const needMonthSwitch =
          action.focusedDay != null &&
          !disableSwitchToMonthOnDayFocus &&
          !utils.isSameMonth(state.currentMonth, action.focusedDay);
        return _extends({}, state, {
          focusedDay: action.focusedDay,
          isMonthSwitchingAnimating:
            needMonthSwitch && !reduceAnimations && !action.withoutMonthSwitchingAnimation,
          currentMonth: needMonthSwitch
            ? utils.startOfMonth(action.focusedDay)
            : state.currentMonth,
          slideDirection:
            action.focusedDay != null && utils.isAfterDay(action.focusedDay, state.currentMonth)
              ? 'left'
              : 'right',
        });
      }
      default:
        throw new Error('missing support');
    }
  };
var useCalendarState = (params) => {
  const {
    value,
    referenceDate: referenceDateProp,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus = false,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate,
    timezone,
  } = params;
  const utils = useUtils();
  const reducerFn = React23.useRef(
    createCalendarStateReducer(Boolean(reduceAnimations), disableSwitchToMonthOnDayFocus, utils)
  ).current;
  const referenceDate = React23.useMemo(
    () => {
      return singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        timezone,
        props: params,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone]
  );
  const [calendarState, dispatch] = React23.useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: referenceDate,
    currentMonth: utils.startOfMonth(referenceDate),
    slideDirection: 'left',
  });
  React23.useEffect(() => {
    dispatch({
      type: 'changeMonthTimezone',
      newTimezone: utils.getTimezone(referenceDate),
    });
  }, [referenceDate, utils]);
  const handleChangeMonth = React23.useCallback(
    (payload) => {
      dispatch(
        _extends(
          {
            type: 'changeMonth',
          },
          payload
        )
      );
      if (onMonthChange) {
        onMonthChange(payload.newMonth);
      }
    },
    [onMonthChange]
  );
  const changeMonth = React23.useCallback(
    (newDate) => {
      const newDateRequested = newDate;
      if (utils.isSameMonth(newDateRequested, calendarState.currentMonth)) {
        return;
      }
      handleChangeMonth({
        newMonth: utils.startOfMonth(newDateRequested),
        direction: utils.isAfterDay(newDateRequested, calendarState.currentMonth)
          ? 'left'
          : 'right',
      });
    },
    [calendarState.currentMonth, handleChangeMonth, utils]
  );
  const isDateDisabled = useIsDateDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    timezone,
  });
  const onMonthSwitchingAnimationEnd = React23.useCallback(() => {
    dispatch({
      type: 'finishMonthSwitchingAnimation',
    });
  }, []);
  const changeFocusedDay = useEventCallback_default(
    (newFocusedDate, withoutMonthSwitchingAnimation) => {
      if (!isDateDisabled(newFocusedDate)) {
        dispatch({
          type: 'changeFocusedDay',
          focusedDay: newFocusedDate,
          withoutMonthSwitchingAnimation,
        });
      }
    }
  );
  return {
    referenceDate,
    calendarState,
    changeMonth,
    changeFocusedDay,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    handleChangeMonth,
  };
};

// node_modules/@mui/x-date-pickers/DateCalendar/PickersFadeTransitionGroup.js
var React24 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/DateCalendar/pickersFadeTransitionGroupClasses.js
var getPickersFadeTransitionGroupUtilityClass = (slot) =>
  generateUtilityClass('MuiPickersFadeTransitionGroup', slot);
var pickersFadeTransitionGroupClasses = generateUtilityClasses('MuiPickersFadeTransitionGroup', [
  'root',
]);

// node_modules/@mui/x-date-pickers/DateCalendar/PickersFadeTransitionGroup.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var useUtilityClasses3 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };
  return composeClasses(slots, getPickersFadeTransitionGroupUtilityClass, classes);
};
var PickersFadeTransitionGroupRoot = styled_default(TransitionGroup_default, {
  name: 'MuiPickersFadeTransitionGroup',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'block',
  position: 'relative',
});
function PickersFadeTransitionGroup(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersFadeTransitionGroup',
  });
  const { children, className, reduceAnimations, transKey } = props;
  const classes = useUtilityClasses3(props);
  const theme = useTheme();
  if (reduceAnimations) {
    return children;
  }
  return (0, import_jsx_runtime4.jsx)(PickersFadeTransitionGroupRoot, {
    className: clsx_default(classes.root, className),
    children: (0, import_jsx_runtime4.jsx)(
      Fade_default,
      {
        appear: false,
        mountOnEnter: true,
        unmountOnExit: true,
        timeout: {
          appear: theme.transitions.duration.enteringScreen,
          enter: theme.transitions.duration.enteringScreen,
          exit: 0,
        },
        children,
      },
      transKey
    ),
  });
}

// node_modules/@mui/x-date-pickers/DateCalendar/DayCalendar.js
var React27 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/PickersDay/PickersDay.js
var React25 = __toESM(require_react());
var import_prop_types5 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/internals/constants/dimensions.js
var DAY_SIZE = 36;
var DAY_MARGIN = 2;
var DIALOG_WIDTH = 320;
var MAX_CALENDAR_HEIGHT = 280;
var VIEW_HEIGHT = 336;

// node_modules/@mui/x-date-pickers/PickersDay/pickersDayClasses.js
function getPickersDayUtilityClass(slot) {
  return generateUtilityClass('MuiPickersDay', slot);
}
var pickersDayClasses = generateUtilityClasses('MuiPickersDay', [
  'root',
  'dayWithMargin',
  'dayOutsideMonth',
  'hiddenDaySpacingFiller',
  'today',
  'selected',
  'disabled',
]);

// node_modules/@mui/x-date-pickers/PickersDay/PickersDay.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var _excluded4 = [
  'autoFocus',
  'className',
  'day',
  'disabled',
  'disableHighlightToday',
  'disableMargin',
  'hidden',
  'isAnimating',
  'onClick',
  'onDaySelect',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onMouseDown',
  'onMouseEnter',
  'outsideCurrentMonth',
  'selected',
  'showDaysOutsideCurrentMonth',
  'children',
  'today',
  'isFirstVisibleCell',
  'isLastVisibleCell',
];
var useUtilityClasses4 = (ownerState) => {
  const {
    selected,
    disableMargin,
    disableHighlightToday,
    today,
    disabled,
    outsideCurrentMonth,
    showDaysOutsideCurrentMonth,
    classes,
  } = ownerState;
  const isHiddenDaySpacingFiller = outsideCurrentMonth && !showDaysOutsideCurrentMonth;
  const slots = {
    root: [
      'root',
      selected && !isHiddenDaySpacingFiller && 'selected',
      disabled && 'disabled',
      !disableMargin && 'dayWithMargin',
      !disableHighlightToday && today && 'today',
      outsideCurrentMonth && showDaysOutsideCurrentMonth && 'dayOutsideMonth',
      isHiddenDaySpacingFiller && 'hiddenDaySpacingFiller',
    ],
    hiddenDaySpacingFiller: ['hiddenDaySpacingFiller'],
  };
  return composeClasses(slots, getPickersDayUtilityClass, classes);
};
var styleArg = ({ theme }) =>
  _extends({}, theme.typography.caption, {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: '50%',
    padding: 0,
    // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
    backgroundColor: 'transparent',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.short,
    }),
    color: (theme.vars || theme).palette.text.primary,
    '@media (pointer: fine)': {
      '&:hover': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
          : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
      },
    },
    '&:focus': {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
        : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
      [`&.${pickersDayClasses.selected}`]: {
        willChange: 'background-color',
        backgroundColor: (theme.vars || theme).palette.primary.dark,
      },
    },
    [`&.${pickersDayClasses.selected}`]: {
      color: (theme.vars || theme).palette.primary.contrastText,
      backgroundColor: (theme.vars || theme).palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      '&:hover': {
        willChange: 'background-color',
        backgroundColor: (theme.vars || theme).palette.primary.dark,
      },
    },
    [`&.${pickersDayClasses.disabled}:not(.${pickersDayClasses.selected})`]: {
      color: (theme.vars || theme).palette.text.disabled,
    },
    [`&.${pickersDayClasses.disabled}&.${pickersDayClasses.selected}`]: {
      opacity: 0.6,
    },
    variants: [
      {
        props: {
          disableMargin: false,
        },
        style: {
          margin: `0 ${DAY_MARGIN}px`,
        },
      },
      {
        props: {
          outsideCurrentMonth: true,
          showDaysOutsideCurrentMonth: true,
        },
        style: {
          color: (theme.vars || theme).palette.text.secondary,
        },
      },
      {
        props: {
          disableHighlightToday: false,
          today: true,
        },
        style: {
          [`&:not(.${pickersDayClasses.selected})`]: {
            border: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
          },
        },
      },
    ],
  });
var overridesResolver = (props, styles) => {
  const { ownerState } = props;
  return [
    styles.root,
    !ownerState.disableMargin && styles.dayWithMargin,
    !ownerState.disableHighlightToday && ownerState.today && styles.today,
    !ownerState.outsideCurrentMonth &&
      ownerState.showDaysOutsideCurrentMonth &&
      styles.dayOutsideMonth,
    ownerState.outsideCurrentMonth &&
      !ownerState.showDaysOutsideCurrentMonth &&
      styles.hiddenDaySpacingFiller,
  ];
};
var PickersDayRoot = styled_default(ButtonBase_default, {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver,
})(styleArg);
var PickersDayFiller = styled_default('div', {
  name: 'MuiPickersDay',
  slot: 'Root',
  overridesResolver,
})(({ theme }) =>
  _extends(
    {},
    styleArg({
      theme,
    }),
    {
      // visibility: 'hidden' does not work here as it hides the element from screen readers as well
      opacity: 0,
      pointerEvents: 'none',
    }
  )
);
var noop = () => {};
var PickersDayRaw = React25.forwardRef(function PickersDay(inProps, forwardedRef) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersDay',
  });
  const {
      autoFocus = false,
      className,
      day,
      disabled = false,
      disableHighlightToday = false,
      disableMargin = false,
      isAnimating,
      onClick,
      onDaySelect,
      onFocus = noop,
      onBlur = noop,
      onKeyDown = noop,
      onMouseDown = noop,
      onMouseEnter = noop,
      outsideCurrentMonth,
      selected = false,
      showDaysOutsideCurrentMonth = false,
      children,
      today: isToday = false,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded4);
  const ownerState = _extends({}, props, {
    autoFocus,
    disabled,
    disableHighlightToday,
    disableMargin,
    selected,
    showDaysOutsideCurrentMonth,
    today: isToday,
  });
  const classes = useUtilityClasses4(ownerState);
  const utils = useUtils();
  const ref = React25.useRef(null);
  const handleRef = useForkRef(ref, forwardedRef);
  useEnhancedEffect_default(() => {
    if (autoFocus && !disabled && !isAnimating && !outsideCurrentMonth) {
      ref.current.focus();
    }
  }, [autoFocus, disabled, isAnimating, outsideCurrentMonth]);
  const handleMouseDown = (event) => {
    onMouseDown(event);
    if (outsideCurrentMonth) {
      event.preventDefault();
    }
  };
  const handleClick = (event) => {
    if (!disabled) {
      onDaySelect(day);
    }
    if (outsideCurrentMonth) {
      event.currentTarget.focus();
    }
    if (onClick) {
      onClick(event);
    }
  };
  if (outsideCurrentMonth && !showDaysOutsideCurrentMonth) {
    return (0, import_jsx_runtime5.jsx)(PickersDayFiller, {
      className: clsx_default(classes.root, classes.hiddenDaySpacingFiller, className),
      ownerState,
      role: other.role,
    });
  }
  return (0, import_jsx_runtime5.jsx)(
    PickersDayRoot,
    _extends(
      {
        className: clsx_default(classes.root, className),
        ref: handleRef,
        centerRipple: true,
        disabled,
        tabIndex: selected ? 0 : -1,
        onKeyDown: (event) => onKeyDown(event, day),
        onFocus: (event) => onFocus(event, day),
        onBlur: (event) => onBlur(event, day),
        onMouseEnter: (event) => onMouseEnter(event, day),
        onClick: handleClick,
        onMouseDown: handleMouseDown,
      },
      other,
      {
        ownerState,
        children: !children ? utils.format(day, 'dayOfMonth') : children,
      }
    )
  );
});
true
  ? (PickersDayRaw.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * A ref for imperative actions.
       * It currently only supports `focusVisible()` action.
       */
      action: import_prop_types5.default.oneOfType([
        import_prop_types5.default.func,
        import_prop_types5.default.shape({
          current: import_prop_types5.default.shape({
            focusVisible: import_prop_types5.default.func.isRequired,
          }),
        }),
      ]),
      /**
       * If `true`, the ripples are centered.
       * They won't start at the cursor interaction position.
       * @default false
       */
      centerRipple: import_prop_types5.default.bool,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types5.default.object,
      className: import_prop_types5.default.string,
      component: import_prop_types5.default.elementType,
      /**
       * The date to show.
       */
      day: import_prop_types5.default.object.isRequired,
      /**
       * If `true`, renders as disabled.
       * @default false
       */
      disabled: import_prop_types5.default.bool,
      /**
       * If `true`, today's date is rendering without highlighting with circle.
       * @default false
       */
      disableHighlightToday: import_prop_types5.default.bool,
      /**
       * If `true`, days are rendering without margin. Useful for displaying linked range of days.
       * @default false
       */
      disableMargin: import_prop_types5.default.bool,
      /**
       * If `true`, the ripple effect is disabled.
       *
       * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
       * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
       * @default false
       */
      disableRipple: import_prop_types5.default.bool,
      /**
       * If `true`, the touch ripple effect is disabled.
       * @default false
       */
      disableTouchRipple: import_prop_types5.default.bool,
      /**
       * If `true`, the base button will have a keyboard focus ripple.
       * @default false
       */
      focusRipple: import_prop_types5.default.bool,
      /**
       * This prop can help identify which element has keyboard focus.
       * The class name will be applied when the element gains the focus through keyboard interaction.
       * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
       * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
       * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
       * if needed.
       */
      focusVisibleClassName: import_prop_types5.default.string,
      isAnimating: import_prop_types5.default.bool,
      /**
       * If `true`, day is the first visible cell of the month.
       * Either the first day of the month or the first day of the week depending on `showDaysOutsideCurrentMonth`.
       */
      isFirstVisibleCell: import_prop_types5.default.bool.isRequired,
      /**
       * If `true`, day is the last visible cell of the month.
       * Either the last day of the month or the last day of the week depending on `showDaysOutsideCurrentMonth`.
       */
      isLastVisibleCell: import_prop_types5.default.bool.isRequired,
      onBlur: import_prop_types5.default.func,
      onDaySelect: import_prop_types5.default.func.isRequired,
      onFocus: import_prop_types5.default.func,
      /**
       * Callback fired when the component is focused with a keyboard.
       * We trigger a `onFocus` callback too.
       */
      onFocusVisible: import_prop_types5.default.func,
      onKeyDown: import_prop_types5.default.func,
      onMouseEnter: import_prop_types5.default.func,
      /**
       * If `true`, day is outside of month and will be hidden.
       */
      outsideCurrentMonth: import_prop_types5.default.bool.isRequired,
      /**
       * If `true`, renders as selected.
       * @default false
       */
      selected: import_prop_types5.default.bool,
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
      showDaysOutsideCurrentMonth: import_prop_types5.default.bool,
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
      /**
       * @default 0
       */
      tabIndex: import_prop_types5.default.number,
      /**
       * If `true`, renders as today date.
       * @default false
       */
      today: import_prop_types5.default.bool,
      /**
       * Props applied to the `TouchRipple` element.
       */
      TouchRippleProps: import_prop_types5.default.object,
      /**
       * A ref that points to the `TouchRipple` element.
       */
      touchRippleRef: import_prop_types5.default.oneOfType([
        import_prop_types5.default.func,
        import_prop_types5.default.shape({
          current: import_prop_types5.default.shape({
            pulsate: import_prop_types5.default.func.isRequired,
            start: import_prop_types5.default.func.isRequired,
            stop: import_prop_types5.default.func.isRequired,
          }),
        }),
      ]),
    })
  : void 0;
var PickersDay2 = React25.memo(PickersDayRaw);

// node_modules/@mui/x-date-pickers/DateCalendar/PickersSlideTransition.js
var React26 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/DateCalendar/pickersSlideTransitionClasses.js
var getPickersSlideTransitionUtilityClass = (slot) =>
  generateUtilityClass('MuiPickersSlideTransition', slot);
var pickersSlideTransitionClasses = generateUtilityClasses('MuiPickersSlideTransition', [
  'root',
  'slideEnter-left',
  'slideEnter-right',
  'slideEnterActive',
  'slideExit',
  'slideExitActiveLeft-left',
  'slideExitActiveLeft-right',
]);

// node_modules/@mui/x-date-pickers/DateCalendar/PickersSlideTransition.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var _excluded5 = [
  'children',
  'className',
  'reduceAnimations',
  'slideDirection',
  'transKey',
  'classes',
];
var useUtilityClasses5 = (ownerState) => {
  const { classes, slideDirection } = ownerState;
  const slots = {
    root: ['root'],
    exit: ['slideExit'],
    enterActive: ['slideEnterActive'],
    enter: [`slideEnter-${slideDirection}`],
    exitActive: [`slideExitActiveLeft-${slideDirection}`],
  };
  return composeClasses(slots, getPickersSlideTransitionUtilityClass, classes);
};
var PickersSlideTransitionRoot = styled_default(TransitionGroup_default, {
  name: 'MuiPickersSlideTransition',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    styles.root,
    {
      [`.${pickersSlideTransitionClasses['slideEnter-left']}`]: styles['slideEnter-left'],
    },
    {
      [`.${pickersSlideTransitionClasses['slideEnter-right']}`]: styles['slideEnter-right'],
    },
    {
      [`.${pickersSlideTransitionClasses.slideEnterActive}`]: styles.slideEnterActive,
    },
    {
      [`.${pickersSlideTransitionClasses.slideExit}`]: styles.slideExit,
    },
    {
      [`.${pickersSlideTransitionClasses['slideExitActiveLeft-left']}`]:
        styles['slideExitActiveLeft-left'],
    },
    {
      [`.${pickersSlideTransitionClasses['slideExitActiveLeft-right']}`]:
        styles['slideExitActiveLeft-right'],
    },
  ],
})(({ theme }) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
  });
  return {
    display: 'block',
    position: 'relative',
    overflowX: 'hidden',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
    },
    [`& .${pickersSlideTransitionClasses['slideEnter-left']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      zIndex: 1,
    },
    [`& .${pickersSlideTransitionClasses['slideEnter-right']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      zIndex: 1,
    },
    [`& .${pickersSlideTransitionClasses.slideEnterActive}`]: {
      transform: 'translate(0%)',
      transition: slideTransition,
    },
    [`& .${pickersSlideTransitionClasses.slideExit}`]: {
      transform: 'translate(0%)',
    },
    [`& .${pickersSlideTransitionClasses['slideExitActiveLeft-left']}`]: {
      willChange: 'transform',
      transform: 'translate(-100%)',
      transition: slideTransition,
      zIndex: 0,
    },
    [`& .${pickersSlideTransitionClasses['slideExitActiveLeft-right']}`]: {
      willChange: 'transform',
      transform: 'translate(100%)',
      transition: slideTransition,
      zIndex: 0,
    },
  };
});
function PickersSlideTransition(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersSlideTransition',
  });
  const {
      children,
      className,
      reduceAnimations,
      transKey,
      // extracting `classes` from `other`
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded5);
  const classes = useUtilityClasses5(props);
  const theme = useTheme();
  if (reduceAnimations) {
    return (0, import_jsx_runtime6.jsx)('div', {
      className: clsx_default(classes.root, className),
      children,
    });
  }
  const transitionClasses = {
    exit: classes.exit,
    enterActive: classes.enterActive,
    enter: classes.enter,
    exitActive: classes.exitActive,
  };
  return (0, import_jsx_runtime6.jsx)(PickersSlideTransitionRoot, {
    className: clsx_default(classes.root, className),
    childFactory: (element) =>
      React26.cloneElement(element, {
        classNames: transitionClasses,
      }),
    role: 'presentation',
    children: (0, import_jsx_runtime6.jsx)(
      CSSTransition_default,
      _extends(
        {
          mountOnEnter: true,
          unmountOnExit: true,
          timeout: theme.transitions.duration.complex,
          classNames: transitionClasses,
        },
        other,
        {
          children,
        }
      ),
      transKey
    ),
  });
}

// node_modules/@mui/x-date-pickers/DateCalendar/dayCalendarClasses.js
var getDayCalendarUtilityClass = (slot) => generateUtilityClass('MuiDayCalendar', slot);
var dayCalendarClasses = generateUtilityClasses('MuiDayCalendar', [
  'root',
  'header',
  'weekDayLabel',
  'loadingContainer',
  'slideTransition',
  'monthContainer',
  'weekContainer',
  'weekNumberLabel',
  'weekNumber',
]);

// node_modules/@mui/x-date-pickers/DateCalendar/DayCalendar.js
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var _excluded6 = [
  'parentProps',
  'day',
  'focusableDay',
  'selectedDays',
  'isDateDisabled',
  'currentMonthNumber',
  'isViewFocused',
];
var _excluded22 = ['ownerState'];
var useUtilityClasses6 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    header: ['header'],
    weekDayLabel: ['weekDayLabel'],
    loadingContainer: ['loadingContainer'],
    slideTransition: ['slideTransition'],
    monthContainer: ['monthContainer'],
    weekContainer: ['weekContainer'],
    weekNumberLabel: ['weekNumberLabel'],
    weekNumber: ['weekNumber'],
  };
  return composeClasses(slots, getDayCalendarUtilityClass, classes);
};
var weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 2) * 6;
var PickersCalendarDayRoot = styled_default('div', {
  name: 'MuiDayCalendar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});
var PickersCalendarDayHeader = styled_default('div', {
  name: 'MuiDayCalendar',
  slot: 'Header',
  overridesResolver: (_, styles) => styles.header,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
var PickersCalendarWeekDayLabel = styled_default(Typography_default, {
  name: 'MuiDayCalendar',
  slot: 'WeekDayLabel',
  overridesResolver: (_, styles) => styles.weekDayLabel,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));
var PickersCalendarWeekNumberLabel = styled_default(Typography_default, {
  name: 'MuiDayCalendar',
  slot: 'WeekNumberLabel',
  overridesResolver: (_, styles) => styles.weekNumberLabel,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));
var PickersCalendarWeekNumber = styled_default(Typography_default, {
  name: 'MuiDayCalendar',
  slot: 'WeekNumber',
  overridesResolver: (_, styles) => styles.weekNumber,
})(({ theme }) =>
  _extends({}, theme.typography.caption, {
    width: DAY_SIZE,
    height: DAY_SIZE,
    padding: 0,
    margin: `0 ${DAY_MARGIN}px`,
    color: theme.palette.text.disabled,
    fontSize: '0.75rem',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'inline-flex',
  })
);
var PickersCalendarLoadingContainer = styled_default('div', {
  name: 'MuiDayCalendar',
  slot: 'LoadingContainer',
  overridesResolver: (_, styles) => styles.loadingContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight,
});
var PickersCalendarSlideTransition = styled_default(PickersSlideTransition, {
  name: 'MuiDayCalendar',
  slot: 'SlideTransition',
  overridesResolver: (_, styles) => styles.slideTransition,
})({
  minHeight: weeksContainerHeight,
});
var PickersCalendarWeekContainer = styled_default('div', {
  name: 'MuiDayCalendar',
  slot: 'MonthContainer',
  overridesResolver: (_, styles) => styles.monthContainer,
})({
  overflow: 'hidden',
});
var PickersCalendarWeek = styled_default('div', {
  name: 'MuiDayCalendar',
  slot: 'WeekContainer',
  overridesResolver: (_, styles) => styles.weekContainer,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});
function WrappedDay(_ref) {
  let {
      parentProps,
      day,
      focusableDay,
      selectedDays,
      isDateDisabled,
      currentMonthNumber,
      isViewFocused,
    } = _ref,
    other = _objectWithoutPropertiesLoose(_ref, _excluded6);
  const {
    disabled,
    disableHighlightToday,
    isMonthSwitchingAnimating,
    showDaysOutsideCurrentMonth,
    slots,
    slotProps,
    timezone,
  } = parentProps;
  const utils = useUtils();
  const now = useNow(timezone);
  const isFocusableDay = focusableDay !== null && utils.isSameDay(day, focusableDay);
  const isSelected = selectedDays.some((selectedDay) => utils.isSameDay(selectedDay, day));
  const isToday = utils.isSameDay(day, now);
  const Day = (slots == null ? void 0 : slots.day) ?? PickersDay2;
  const _useSlotProps = useSlotProps_default({
      elementType: Day,
      externalSlotProps: slotProps == null ? void 0 : slotProps.day,
      additionalProps: _extends(
        {
          disableHighlightToday,
          showDaysOutsideCurrentMonth,
          role: 'gridcell',
          isAnimating: isMonthSwitchingAnimating,
          // it is used in date range dragging logic by accessing `dataset.timestamp`
          'data-timestamp': utils.toJsDate(day).valueOf(),
        },
        other
      ),
      ownerState: _extends({}, parentProps, {
        day,
        selected: isSelected,
      }),
    }),
    dayProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded22);
  const isDisabled = React27.useMemo(
    () => disabled || isDateDisabled(day),
    [disabled, isDateDisabled, day]
  );
  const outsideCurrentMonth = React27.useMemo(
    () => utils.getMonth(day) !== currentMonthNumber,
    [utils, day, currentMonthNumber]
  );
  const isFirstVisibleCell = React27.useMemo(() => {
    const startOfMonth = utils.startOfMonth(utils.setMonth(day, currentMonthNumber));
    if (!showDaysOutsideCurrentMonth) {
      return utils.isSameDay(day, startOfMonth);
    }
    return utils.isSameDay(day, utils.startOfWeek(startOfMonth));
  }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, utils]);
  const isLastVisibleCell = React27.useMemo(() => {
    const endOfMonth = utils.endOfMonth(utils.setMonth(day, currentMonthNumber));
    if (!showDaysOutsideCurrentMonth) {
      return utils.isSameDay(day, endOfMonth);
    }
    return utils.isSameDay(day, utils.endOfWeek(endOfMonth));
  }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, utils]);
  return (0, import_jsx_runtime7.jsx)(
    Day,
    _extends({}, dayProps, {
      day,
      disabled: isDisabled,
      autoFocus: isViewFocused && isFocusableDay,
      today: isToday,
      outsideCurrentMonth,
      isFirstVisibleCell,
      isLastVisibleCell,
      selected: isSelected,
      tabIndex: isFocusableDay ? 0 : -1,
      'aria-selected': isSelected,
      'aria-current': isToday ? 'date' : void 0,
    })
  );
}
function DayCalendar(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDayCalendar',
  });
  const utils = useUtils();
  const {
    onFocusedDayChange,
    className,
    currentMonth,
    selectedDays,
    focusedDay,
    loading,
    onSelectedDaysChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderLoading = () =>
      (0, import_jsx_runtime7.jsx)('span', {
        children: '...',
      }),
    slideDirection,
    TransitionProps,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    dayOfWeekFormatter = (date) => utils.format(date, 'weekdayShort').charAt(0).toUpperCase(),
    hasFocus,
    onFocusedViewChange,
    gridLabelId,
    displayWeekNumber,
    fixedWeekNumber,
    autoFocus,
    timezone,
  } = props;
  const now = useNow(timezone);
  const classes = useUtilityClasses6(props);
  const isRtl = useRtl();
  const isDateDisabled = useIsDateDisabled({
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    timezone,
  });
  const translations = usePickersTranslations();
  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'DayCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus ?? false,
  });
  const [internalFocusedDay, setInternalFocusedDay] = React27.useState(() => focusedDay || now);
  const handleDaySelect = useEventCallback_default((day) => {
    if (readOnly) {
      return;
    }
    onSelectedDaysChange(day);
  });
  const focusDay = (day) => {
    if (!isDateDisabled(day)) {
      onFocusedDayChange(day);
      setInternalFocusedDay(day);
      onFocusedViewChange == null ? void 0 : onFocusedViewChange(true);
      setInternalHasFocus(true);
    }
  };
  const handleKeyDown = useEventCallback_default((event, day) => {
    switch (event.key) {
      case 'ArrowUp':
        focusDay(utils.addDays(day, -7));
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusDay(utils.addDays(day, 7));
        event.preventDefault();
        break;
      case 'ArrowLeft': {
        const newFocusedDayDefault = utils.addDays(day, isRtl ? 1 : -1);
        const nextAvailableMonth = utils.addMonths(day, isRtl ? 1 : -1);
        const closestDayToFocus = findClosestEnabledDate({
          utils,
          date: newFocusedDayDefault,
          minDate: isRtl ? newFocusedDayDefault : utils.startOfMonth(nextAvailableMonth),
          maxDate: isRtl ? utils.endOfMonth(nextAvailableMonth) : newFocusedDayDefault,
          isDateDisabled,
          timezone,
        });
        focusDay(closestDayToFocus || newFocusedDayDefault);
        event.preventDefault();
        break;
      }
      case 'ArrowRight': {
        const newFocusedDayDefault = utils.addDays(day, isRtl ? -1 : 1);
        const nextAvailableMonth = utils.addMonths(day, isRtl ? -1 : 1);
        const closestDayToFocus = findClosestEnabledDate({
          utils,
          date: newFocusedDayDefault,
          minDate: isRtl ? utils.startOfMonth(nextAvailableMonth) : newFocusedDayDefault,
          maxDate: isRtl ? newFocusedDayDefault : utils.endOfMonth(nextAvailableMonth),
          isDateDisabled,
          timezone,
        });
        focusDay(closestDayToFocus || newFocusedDayDefault);
        event.preventDefault();
        break;
      }
      case 'Home':
        focusDay(utils.startOfWeek(day));
        event.preventDefault();
        break;
      case 'End':
        focusDay(utils.endOfWeek(day));
        event.preventDefault();
        break;
      case 'PageUp':
        focusDay(utils.addMonths(day, 1));
        event.preventDefault();
        break;
      case 'PageDown':
        focusDay(utils.addMonths(day, -1));
        event.preventDefault();
        break;
      default:
        break;
    }
  });
  const handleFocus = useEventCallback_default((event, day) => focusDay(day));
  const handleBlur = useEventCallback_default((event, day) => {
    if (internalHasFocus && utils.isSameDay(internalFocusedDay, day)) {
      onFocusedViewChange == null ? void 0 : onFocusedViewChange(false);
    }
  });
  const currentMonthNumber = utils.getMonth(currentMonth);
  const currentYearNumber = utils.getYear(currentMonth);
  const validSelectedDays = React27.useMemo(
    () => selectedDays.filter((day) => !!day).map((day) => utils.startOfDay(day)),
    [utils, selectedDays]
  );
  const transitionKey = `${currentYearNumber}-${currentMonthNumber}`;
  const slideNodeRef = React27.useMemo(() => React27.createRef(), [transitionKey]);
  const focusableDay = React27.useMemo(() => {
    const startOfMonth = utils.startOfMonth(currentMonth);
    const endOfMonth = utils.endOfMonth(currentMonth);
    if (
      isDateDisabled(internalFocusedDay) ||
      utils.isAfterDay(internalFocusedDay, endOfMonth) ||
      utils.isBeforeDay(internalFocusedDay, startOfMonth)
    ) {
      return findClosestEnabledDate({
        utils,
        date: internalFocusedDay,
        minDate: startOfMonth,
        maxDate: endOfMonth,
        disablePast,
        disableFuture,
        isDateDisabled,
        timezone,
      });
    }
    return internalFocusedDay;
  }, [
    currentMonth,
    disableFuture,
    disablePast,
    internalFocusedDay,
    isDateDisabled,
    utils,
    timezone,
  ]);
  const weeksToDisplay = React27.useMemo(() => {
    const toDisplay = utils.getWeekArray(currentMonth);
    let nextMonth = utils.addMonths(currentMonth, 1);
    while (fixedWeekNumber && toDisplay.length < fixedWeekNumber) {
      const additionalWeeks = utils.getWeekArray(nextMonth);
      const hasCommonWeek = utils.isSameDay(
        toDisplay[toDisplay.length - 1][0],
        additionalWeeks[0][0]
      );
      additionalWeeks.slice(hasCommonWeek ? 1 : 0).forEach((week) => {
        if (toDisplay.length < fixedWeekNumber) {
          toDisplay.push(week);
        }
      });
      nextMonth = utils.addMonths(nextMonth, 1);
    }
    return toDisplay;
  }, [currentMonth, fixedWeekNumber, utils]);
  return (0, import_jsx_runtime7.jsxs)(PickersCalendarDayRoot, {
    role: 'grid',
    'aria-labelledby': gridLabelId,
    className: classes.root,
    children: [
      (0, import_jsx_runtime7.jsxs)(PickersCalendarDayHeader, {
        role: 'row',
        className: classes.header,
        children: [
          displayWeekNumber &&
            (0, import_jsx_runtime7.jsx)(PickersCalendarWeekNumberLabel, {
              variant: 'caption',
              role: 'columnheader',
              'aria-label': translations.calendarWeekNumberHeaderLabel,
              className: classes.weekNumberLabel,
              children: translations.calendarWeekNumberHeaderText,
            }),
          getWeekdays(utils, now).map((weekday, i) =>
            (0, import_jsx_runtime7.jsx)(
              PickersCalendarWeekDayLabel,
              {
                variant: 'caption',
                role: 'columnheader',
                'aria-label': utils.format(weekday, 'weekday'),
                className: classes.weekDayLabel,
                children: dayOfWeekFormatter(weekday),
              },
              i.toString()
            )
          ),
        ],
      }),
      loading
        ? (0, import_jsx_runtime7.jsx)(PickersCalendarLoadingContainer, {
            className: classes.loadingContainer,
            children: renderLoading(),
          })
        : (0, import_jsx_runtime7.jsx)(
            PickersCalendarSlideTransition,
            _extends(
              {
                transKey: transitionKey,
                onExited: onMonthSwitchingAnimationEnd,
                reduceAnimations,
                slideDirection,
                className: clsx_default(className, classes.slideTransition),
              },
              TransitionProps,
              {
                nodeRef: slideNodeRef,
                children: (0, import_jsx_runtime7.jsx)(PickersCalendarWeekContainer, {
                  ref: slideNodeRef,
                  role: 'rowgroup',
                  className: classes.monthContainer,
                  children: weeksToDisplay.map((week, index) =>
                    (0, import_jsx_runtime7.jsxs)(
                      PickersCalendarWeek,
                      {
                        role: 'row',
                        className: classes.weekContainer,
                        'aria-rowindex': index + 1,
                        children: [
                          displayWeekNumber &&
                            (0, import_jsx_runtime7.jsx)(PickersCalendarWeekNumber, {
                              className: classes.weekNumber,
                              role: 'rowheader',
                              'aria-label': translations.calendarWeekNumberAriaLabelText(
                                utils.getWeekNumber(week[0])
                              ),
                              children: translations.calendarWeekNumberText(
                                utils.getWeekNumber(week[0])
                              ),
                            }),
                          week.map((day, dayIndex) =>
                            (0, import_jsx_runtime7.jsx)(
                              WrappedDay,
                              {
                                parentProps: props,
                                day,
                                selectedDays: validSelectedDays,
                                focusableDay,
                                onKeyDown: handleKeyDown,
                                onFocus: handleFocus,
                                onBlur: handleBlur,
                                onDaySelect: handleDaySelect,
                                isDateDisabled,
                                currentMonthNumber,
                                isViewFocused: internalHasFocus,
                                'aria-colindex': dayIndex + 1,
                              },
                              day.toString()
                            )
                          ),
                        ],
                      },
                      `week-${week[0]}`
                    )
                  ),
                }),
              }
            )
          ),
    ],
  });
}

// node_modules/@mui/x-date-pickers/MonthCalendar/MonthCalendar.js
var React30 = __toESM(require_react());
var import_prop_types6 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/MonthCalendar/PickersMonth.js
var React28 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/MonthCalendar/pickersMonthClasses.js
function getPickersMonthUtilityClass(slot) {
  return generateUtilityClass('MuiPickersMonth', slot);
}
var pickersMonthClasses = generateUtilityClasses('MuiPickersMonth', [
  'root',
  'monthButton',
  'disabled',
  'selected',
]);

// node_modules/@mui/x-date-pickers/MonthCalendar/PickersMonth.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var _excluded7 = [
  'autoFocus',
  'className',
  'children',
  'disabled',
  'selected',
  'value',
  'tabIndex',
  'onClick',
  'onKeyDown',
  'onFocus',
  'onBlur',
  'aria-current',
  'aria-label',
  'monthsPerRow',
  'slots',
  'slotProps',
];
var useUtilityClasses7 = (ownerState) => {
  const { disabled, selected, classes } = ownerState;
  const slots = {
    root: ['root'],
    monthButton: ['monthButton', disabled && 'disabled', selected && 'selected'],
  };
  return composeClasses(slots, getPickersMonthUtilityClass, classes);
};
var PickersMonthRoot = styled_default('div', {
  name: 'MuiPickersMonth',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: '33.3%',
  variants: [
    {
      props: {
        monthsPerRow: 4,
      },
      style: {
        flexBasis: '25%',
      },
    },
  ],
});
var MonthCalendarButton = styled_default('button', {
  name: 'MuiPickersMonth',
  slot: 'MonthButton',
  overridesResolver: (_, styles) => [
    styles.monthButton,
    {
      [`&.${pickersMonthClasses.disabled}`]: styles.disabled,
    },
    {
      [`&.${pickersMonthClasses.selected}`]: styles.selected,
    },
  ],
})(({ theme }) =>
  _extends(
    {
      color: 'unset',
      backgroundColor: 'transparent',
      border: 0,
      outline: 0,
    },
    theme.typography.subtitle1,
    {
      margin: '8px 0',
      height: 36,
      width: 72,
      borderRadius: 18,
      cursor: 'pointer',
      '&:focus': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
          : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
      },
      '&:hover': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
          : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
      },
      '&:disabled': {
        cursor: 'auto',
        pointerEvents: 'none',
      },
      [`&.${pickersMonthClasses.disabled}`]: {
        color: (theme.vars || theme).palette.text.secondary,
      },
      [`&.${pickersMonthClasses.selected}`]: {
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: (theme.vars || theme).palette.primary.main,
        '&:focus, &:hover': {
          backgroundColor: (theme.vars || theme).palette.primary.dark,
        },
      },
    }
  )
);
var PickersMonth = React28.memo(function PickersMonth2(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersMonth',
  });
  const {
      autoFocus,
      className,
      children,
      disabled,
      selected,
      value,
      tabIndex,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      'aria-current': ariaCurrent,
      'aria-label': ariaLabel,
      slots,
      slotProps,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded7);
  const ref = React28.useRef(null);
  const classes = useUtilityClasses7(props);
  useEnhancedEffect_default(() => {
    var _a;
    if (autoFocus) {
      (_a = ref.current) == null ? void 0 : _a.focus();
    }
  }, [autoFocus]);
  const MonthButton = (slots == null ? void 0 : slots.monthButton) ?? MonthCalendarButton;
  const monthButtonProps = useSlotProps_default({
    elementType: MonthButton,
    externalSlotProps: slotProps == null ? void 0 : slotProps.monthButton,
    additionalProps: {
      children,
      disabled,
      tabIndex,
      ref,
      type: 'button',
      role: 'radio',
      'aria-current': ariaCurrent,
      'aria-checked': selected,
      'aria-label': ariaLabel,
      onClick: (event) => onClick(event, value),
      onKeyDown: (event) => onKeyDown(event, value),
      onFocus: (event) => onFocus(event, value),
      onBlur: (event) => onBlur(event, value),
    },
    ownerState: props,
    className: classes.monthButton,
  });
  return (0, import_jsx_runtime8.jsx)(
    PickersMonthRoot,
    _extends(
      {
        className: clsx_default(classes.root, className),
        ownerState: props,
      },
      other,
      {
        children: (0, import_jsx_runtime8.jsx)(MonthButton, _extends({}, monthButtonProps)),
      }
    )
  );
});

// node_modules/@mui/x-date-pickers/MonthCalendar/monthCalendarClasses.js
function getMonthCalendarUtilityClass(slot) {
  return generateUtilityClass('MuiMonthCalendar', slot);
}
var monthCalendarClasses = generateUtilityClasses('MuiMonthCalendar', ['root']);

// node_modules/@mui/x-date-pickers/internals/hooks/useValueWithTimezone.js
var React29 = __toESM(require_react());
var useValueWithTimezone = ({
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  referenceDate,
  onChange,
  valueManager,
}) => {
  const utils = useUtils();
  const firstDefaultValue = React29.useRef(defaultValue);
  const inputValue = valueProp ?? firstDefaultValue.current ?? valueManager.emptyValue;
  const inputTimezone = React29.useMemo(
    () => valueManager.getTimezone(utils, inputValue),
    [utils, valueManager, inputValue]
  );
  const setInputTimezone = useEventCallback_default((newValue) => {
    if (inputTimezone == null) {
      return newValue;
    }
    return valueManager.setTimezone(utils, inputTimezone, newValue);
  });
  let timezoneToRender;
  if (timezoneProp) {
    timezoneToRender = timezoneProp;
  } else if (inputTimezone) {
    timezoneToRender = inputTimezone;
  } else if (referenceDate) {
    timezoneToRender = utils.getTimezone(referenceDate);
  } else {
    timezoneToRender = 'default';
  }
  const valueWithTimezoneToRender = React29.useMemo(
    () => valueManager.setTimezone(utils, timezoneToRender, inputValue),
    [valueManager, utils, timezoneToRender, inputValue]
  );
  const handleValueChange = useEventCallback_default((newValue, ...otherParams) => {
    const newValueWithInputTimezone = setInputTimezone(newValue);
    onChange == null ? void 0 : onChange(newValueWithInputTimezone, ...otherParams);
  });
  return {
    value: valueWithTimezoneToRender,
    handleValueChange,
    timezone: timezoneToRender,
  };
};
var useControlledValueWithTimezone = ({
  name,
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  referenceDate,
  onChange: onChangeProp,
  valueManager,
}) => {
  const [valueWithInputTimezone, setValue] = useControlled({
    name,
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? valueManager.emptyValue,
  });
  const onChange = useEventCallback_default((newValue, ...otherParams) => {
    setValue(newValue);
    onChangeProp == null ? void 0 : onChangeProp(newValue, ...otherParams);
  });
  return useValueWithTimezone({
    timezone: timezoneProp,
    value: valueWithInputTimezone,
    defaultValue: void 0,
    referenceDate,
    onChange,
    valueManager,
  });
};

// node_modules/@mui/x-date-pickers/MonthCalendar/MonthCalendar.js
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var _excluded8 = [
  'className',
  'value',
  'defaultValue',
  'referenceDate',
  'disabled',
  'disableFuture',
  'disablePast',
  'maxDate',
  'minDate',
  'onChange',
  'shouldDisableMonth',
  'readOnly',
  'disableHighlightToday',
  'autoFocus',
  'onMonthFocus',
  'hasFocus',
  'onFocusedViewChange',
  'monthsPerRow',
  'timezone',
  'gridLabelId',
  'slots',
  'slotProps',
];
var useUtilityClasses8 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };
  return composeClasses(slots, getMonthCalendarUtilityClass, classes);
};
function useMonthCalendarDefaultizedProps(props, name) {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const themeProps = useThemeProps({
    props,
    name,
  });
  return _extends(
    {
      disableFuture: false,
      disablePast: false,
    },
    themeProps,
    {
      minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    }
  );
}
var MonthCalendarRoot = styled_default('div', {
  name: 'MuiMonthCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  padding: '0 4px',
  width: DIALOG_WIDTH,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
});
var MonthCalendar = React30.forwardRef(function MonthCalendar2(inProps, ref) {
  const props = useMonthCalendarDefaultizedProps(inProps, 'MuiMonthCalendar');
  const {
      className,
      value: valueProp,
      defaultValue,
      referenceDate: referenceDateProp,
      disabled,
      disableFuture,
      disablePast,
      maxDate,
      minDate,
      onChange,
      shouldDisableMonth,
      readOnly,
      autoFocus = false,
      onMonthFocus,
      hasFocus,
      onFocusedViewChange,
      monthsPerRow = 3,
      timezone: timezoneProp,
      gridLabelId,
      slots,
      slotProps,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded8);
  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'MonthCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });
  const now = useNow(timezone);
  const isRtl = useRtl();
  const utils = useUtils();
  const referenceDate = React30.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        timezone,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.month,
      }),
    []
    // eslint-disable-line react-hooks/exhaustive-deps
  );
  const ownerState = props;
  const classes = useUtilityClasses8(ownerState);
  const todayMonth = React30.useMemo(() => utils.getMonth(now), [utils, now]);
  const selectedMonth = React30.useMemo(() => {
    if (value != null) {
      return utils.getMonth(value);
    }
    return null;
  }, [value, utils]);
  const [focusedMonth, setFocusedMonth] = React30.useState(
    () => selectedMonth || utils.getMonth(referenceDate)
  );
  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'MonthCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus ?? false,
  });
  const changeHasFocus = useEventCallback_default((newHasFocus) => {
    setInternalHasFocus(newHasFocus);
    if (onFocusedViewChange) {
      onFocusedViewChange(newHasFocus);
    }
  });
  const isMonthDisabled = React30.useCallback(
    (dateToValidate) => {
      const firstEnabledMonth = utils.startOfMonth(
        disablePast && utils.isAfter(now, minDate) ? now : minDate
      );
      const lastEnabledMonth = utils.startOfMonth(
        disableFuture && utils.isBefore(now, maxDate) ? now : maxDate
      );
      const monthToValidate = utils.startOfMonth(dateToValidate);
      if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
        return true;
      }
      if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
        return true;
      }
      if (!shouldDisableMonth) {
        return false;
      }
      return shouldDisableMonth(monthToValidate);
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableMonth, utils]
  );
  const handleMonthSelection = useEventCallback_default((event, month) => {
    if (readOnly) {
      return;
    }
    const newDate = utils.setMonth(value ?? referenceDate, month);
    handleValueChange(newDate);
  });
  const focusMonth = useEventCallback_default((month) => {
    if (!isMonthDisabled(utils.setMonth(value ?? referenceDate, month))) {
      setFocusedMonth(month);
      changeHasFocus(true);
      if (onMonthFocus) {
        onMonthFocus(month);
      }
    }
  });
  React30.useEffect(() => {
    setFocusedMonth((prevFocusedMonth) =>
      selectedMonth !== null && prevFocusedMonth !== selectedMonth
        ? selectedMonth
        : prevFocusedMonth
    );
  }, [selectedMonth]);
  const handleKeyDown = useEventCallback_default((event, month) => {
    const monthsInYear = 12;
    const monthsInRow = 3;
    switch (event.key) {
      case 'ArrowUp':
        focusMonth((monthsInYear + month - monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusMonth((monthsInYear + month + monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusMonth((monthsInYear + month + (isRtl ? 1 : -1)) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowRight':
        focusMonth((monthsInYear + month + (isRtl ? -1 : 1)) % monthsInYear);
        event.preventDefault();
        break;
      default:
        break;
    }
  });
  const handleMonthFocus = useEventCallback_default((event, month) => {
    focusMonth(month);
  });
  const handleMonthBlur = useEventCallback_default((event, month) => {
    if (focusedMonth === month) {
      changeHasFocus(false);
    }
  });
  return (0, import_jsx_runtime9.jsx)(
    MonthCalendarRoot,
    _extends(
      {
        ref,
        className: clsx_default(classes.root, className),
        ownerState,
        role: 'radiogroup',
        'aria-labelledby': gridLabelId,
      },
      other,
      {
        children: getMonthsInYear(utils, value ?? referenceDate).map((month) => {
          const monthNumber = utils.getMonth(month);
          const monthText = utils.format(month, 'monthShort');
          const monthLabel = utils.format(month, 'month');
          const isSelected = monthNumber === selectedMonth;
          const isDisabled = disabled || isMonthDisabled(month);
          return (0, import_jsx_runtime9.jsx)(
            PickersMonth,
            {
              selected: isSelected,
              value: monthNumber,
              onClick: handleMonthSelection,
              onKeyDown: handleKeyDown,
              autoFocus: internalHasFocus && monthNumber === focusedMonth,
              disabled: isDisabled,
              tabIndex: monthNumber === focusedMonth && !isDisabled ? 0 : -1,
              onFocus: handleMonthFocus,
              onBlur: handleMonthBlur,
              'aria-current': todayMonth === monthNumber ? 'date' : void 0,
              'aria-label': monthLabel,
              monthsPerRow,
              slots,
              slotProps,
              children: monthText,
            },
            monthText
          );
        }),
      }
    )
  );
});
true
  ? (MonthCalendar.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      autoFocus: import_prop_types6.default.bool,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types6.default.object,
      className: import_prop_types6.default.string,
      /**
       * The default selected value.
       * Used when the component is not controlled.
       */
      defaultValue: import_prop_types6.default.object,
      /**
       * If `true` picker is disabled
       */
      disabled: import_prop_types6.default.bool,
      /**
       * If `true`, disable values after the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disableFuture: import_prop_types6.default.bool,
      /**
       * If `true`, today's date is rendering without highlighting with circle.
       * @default false
       */
      disableHighlightToday: import_prop_types6.default.bool,
      /**
       * If `true`, disable values before the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disablePast: import_prop_types6.default.bool,
      gridLabelId: import_prop_types6.default.string,
      hasFocus: import_prop_types6.default.bool,
      /**
       * Maximal selectable date.
       * @default 2099-12-31
       */
      maxDate: import_prop_types6.default.object,
      /**
       * Minimal selectable date.
       * @default 1900-01-01
       */
      minDate: import_prop_types6.default.object,
      /**
       * Months rendered per row.
       * @default 3
       */
      monthsPerRow: import_prop_types6.default.oneOf([3, 4]),
      /**
       * Callback fired when the value changes.
       * @template TDate
       * @param {TDate} value The new value.
       */
      onChange: import_prop_types6.default.func,
      onFocusedViewChange: import_prop_types6.default.func,
      onMonthFocus: import_prop_types6.default.func,
      /**
       * If `true` picker is readonly
       */
      readOnly: import_prop_types6.default.bool,
      /**
       * The date used to generate the new value when both `value` and `defaultValue` are empty.
       * @default The closest valid month using the validation props, except callbacks such as `shouldDisableMonth`.
       */
      referenceDate: import_prop_types6.default.object,
      /**
       * Disable specific month.
       * @template TDate
       * @param {TDate} month The month to test.
       * @returns {boolean} If `true`, the month will be disabled.
       */
      shouldDisableMonth: import_prop_types6.default.func,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types6.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types6.default.object,
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
      /**
       * Choose which timezone to use for the value.
       * Example: "default", "system", "UTC", "America/New_York".
       * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
       * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
       * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
       */
      timezone: import_prop_types6.default.string,
      /**
       * The selected value.
       * Used when the component is controlled.
       */
      value: import_prop_types6.default.object,
    })
  : void 0;

// node_modules/@mui/x-date-pickers/YearCalendar/YearCalendar.js
var React32 = __toESM(require_react());
var import_prop_types7 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/YearCalendar/PickersYear.js
var React31 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/YearCalendar/pickersYearClasses.js
function getPickersYearUtilityClass(slot) {
  return generateUtilityClass('MuiPickersYear', slot);
}
var pickersYearClasses = generateUtilityClasses('MuiPickersYear', [
  'root',
  'yearButton',
  'selected',
  'disabled',
]);

// node_modules/@mui/x-date-pickers/YearCalendar/PickersYear.js
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var _excluded9 = [
  'autoFocus',
  'className',
  'children',
  'disabled',
  'selected',
  'value',
  'tabIndex',
  'onClick',
  'onKeyDown',
  'onFocus',
  'onBlur',
  'aria-current',
  'yearsPerRow',
  'slots',
  'slotProps',
];
var useUtilityClasses9 = (ownerState) => {
  const { disabled, selected, classes } = ownerState;
  const slots = {
    root: ['root'],
    yearButton: ['yearButton', disabled && 'disabled', selected && 'selected'],
  };
  return composeClasses(slots, getPickersYearUtilityClass, classes);
};
var PickersYearRoot = styled_default('div', {
  name: 'MuiPickersYear',
  slot: 'Root',
  overridesResolver: (_, styles) => [styles.root],
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexBasis: '33.3%',
  variants: [
    {
      props: {
        yearsPerRow: 4,
      },
      style: {
        flexBasis: '25%',
      },
    },
  ],
});
var YearCalendarButton = styled_default('button', {
  name: 'MuiPickersYear',
  slot: 'YearButton',
  overridesResolver: (_, styles) => [
    styles.yearButton,
    {
      [`&.${pickersYearClasses.disabled}`]: styles.disabled,
    },
    {
      [`&.${pickersYearClasses.selected}`]: styles.selected,
    },
  ],
})(({ theme }) =>
  _extends(
    {
      color: 'unset',
      backgroundColor: 'transparent',
      border: 0,
      outline: 0,
    },
    theme.typography.subtitle1,
    {
      margin: '6px 0',
      height: 36,
      width: 72,
      borderRadius: 18,
      cursor: 'pointer',
      '&:focus': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.focusOpacity})`
          : alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
      },
      '&:hover': {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
          : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
      },
      '&:disabled': {
        cursor: 'auto',
        pointerEvents: 'none',
      },
      [`&.${pickersYearClasses.disabled}`]: {
        color: (theme.vars || theme).palette.text.secondary,
      },
      [`&.${pickersYearClasses.selected}`]: {
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: (theme.vars || theme).palette.primary.main,
        '&:focus, &:hover': {
          backgroundColor: (theme.vars || theme).palette.primary.dark,
        },
      },
    }
  )
);
var PickersYear = React31.memo(function PickersYear2(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersYear',
  });
  const {
      autoFocus,
      className,
      children,
      disabled,
      selected,
      value,
      tabIndex,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      'aria-current': ariaCurrent,
      slots,
      slotProps,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded9);
  const ref = React31.useRef(null);
  const classes = useUtilityClasses9(props);
  useEnhancedEffect_default(() => {
    var _a;
    if (autoFocus) {
      (_a = ref.current) == null ? void 0 : _a.focus();
    }
  }, [autoFocus]);
  const YearButton = (slots == null ? void 0 : slots.yearButton) ?? YearCalendarButton;
  const yearButtonProps = useSlotProps_default({
    elementType: YearButton,
    externalSlotProps: slotProps == null ? void 0 : slotProps.yearButton,
    additionalProps: {
      children,
      disabled,
      tabIndex,
      ref,
      type: 'button',
      role: 'radio',
      'aria-current': ariaCurrent,
      'aria-checked': selected,
      onClick: (event) => onClick(event, value),
      onKeyDown: (event) => onKeyDown(event, value),
      onFocus: (event) => onFocus(event, value),
      onBlur: (event) => onBlur(event, value),
    },
    ownerState: props,
    className: classes.yearButton,
  });
  return (0, import_jsx_runtime10.jsx)(
    PickersYearRoot,
    _extends(
      {
        className: clsx_default(classes.root, className),
        ownerState: props,
      },
      other,
      {
        children: (0, import_jsx_runtime10.jsx)(YearButton, _extends({}, yearButtonProps)),
      }
    )
  );
});

// node_modules/@mui/x-date-pickers/YearCalendar/yearCalendarClasses.js
function getYearCalendarUtilityClass(slot) {
  return generateUtilityClass('MuiYearCalendar', slot);
}
var yearCalendarClasses = generateUtilityClasses('MuiYearCalendar', ['root']);

// node_modules/@mui/x-date-pickers/YearCalendar/YearCalendar.js
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var _excluded10 = [
  'autoFocus',
  'className',
  'value',
  'defaultValue',
  'referenceDate',
  'disabled',
  'disableFuture',
  'disablePast',
  'maxDate',
  'minDate',
  'onChange',
  'readOnly',
  'shouldDisableYear',
  'disableHighlightToday',
  'onYearFocus',
  'hasFocus',
  'onFocusedViewChange',
  'yearsOrder',
  'yearsPerRow',
  'timezone',
  'gridLabelId',
  'slots',
  'slotProps',
];
var useUtilityClasses10 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };
  return composeClasses(slots, getYearCalendarUtilityClass, classes);
};
function useYearCalendarDefaultizedProps(props, name) {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const themeProps = useThemeProps({
    props,
    name,
  });
  return _extends(
    {
      disablePast: false,
      disableFuture: false,
    },
    themeProps,
    {
      yearsPerRow: themeProps.yearsPerRow ?? 3,
      minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    }
  );
}
var YearCalendarRoot = styled_default('div', {
  name: 'MuiYearCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflowY: 'auto',
  height: '100%',
  padding: '0 4px',
  width: DIALOG_WIDTH,
  maxHeight: MAX_CALENDAR_HEIGHT,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  position: 'relative',
});
var YearCalendar = React32.forwardRef(function YearCalendar2(inProps, ref) {
  const props = useYearCalendarDefaultizedProps(inProps, 'MuiYearCalendar');
  const {
      autoFocus,
      className,
      value: valueProp,
      defaultValue,
      referenceDate: referenceDateProp,
      disabled,
      disableFuture,
      disablePast,
      maxDate,
      minDate,
      onChange,
      readOnly,
      shouldDisableYear,
      onYearFocus,
      hasFocus,
      onFocusedViewChange,
      yearsOrder = 'asc',
      yearsPerRow,
      timezone: timezoneProp,
      gridLabelId,
      slots,
      slotProps,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded10);
  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'YearCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });
  const now = useNow(timezone);
  const isRtl = useRtl();
  const utils = useUtils();
  const referenceDate = React32.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        timezone,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.year,
      }),
    []
    // eslint-disable-line react-hooks/exhaustive-deps
  );
  const ownerState = props;
  const classes = useUtilityClasses10(ownerState);
  const todayYear = React32.useMemo(() => utils.getYear(now), [utils, now]);
  const selectedYear = React32.useMemo(() => {
    if (value != null) {
      return utils.getYear(value);
    }
    return null;
  }, [value, utils]);
  const [focusedYear, setFocusedYear] = React32.useState(
    () => selectedYear || utils.getYear(referenceDate)
  );
  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'YearCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus ?? false,
  });
  const changeHasFocus = useEventCallback_default((newHasFocus) => {
    setInternalHasFocus(newHasFocus);
    if (onFocusedViewChange) {
      onFocusedViewChange(newHasFocus);
    }
  });
  const isYearDisabled = React32.useCallback(
    (dateToValidate) => {
      if (disablePast && utils.isBeforeYear(dateToValidate, now)) {
        return true;
      }
      if (disableFuture && utils.isAfterYear(dateToValidate, now)) {
        return true;
      }
      if (minDate && utils.isBeforeYear(dateToValidate, minDate)) {
        return true;
      }
      if (maxDate && utils.isAfterYear(dateToValidate, maxDate)) {
        return true;
      }
      if (!shouldDisableYear) {
        return false;
      }
      const yearToValidate = utils.startOfYear(dateToValidate);
      return shouldDisableYear(yearToValidate);
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableYear, utils]
  );
  const handleYearSelection = useEventCallback_default((event, year) => {
    if (readOnly) {
      return;
    }
    const newDate = utils.setYear(value ?? referenceDate, year);
    handleValueChange(newDate);
  });
  const focusYear = useEventCallback_default((year) => {
    if (!isYearDisabled(utils.setYear(value ?? referenceDate, year))) {
      setFocusedYear(year);
      changeHasFocus(true);
      onYearFocus == null ? void 0 : onYearFocus(year);
    }
  });
  React32.useEffect(() => {
    setFocusedYear((prevFocusedYear) =>
      selectedYear !== null && prevFocusedYear !== selectedYear ? selectedYear : prevFocusedYear
    );
  }, [selectedYear]);
  const verticalDirection = yearsOrder !== 'desc' ? yearsPerRow * 1 : yearsPerRow * -1;
  const horizontalDirection =
    (isRtl && yearsOrder === 'asc') || (!isRtl && yearsOrder === 'desc') ? -1 : 1;
  const handleKeyDown = useEventCallback_default((event, year) => {
    switch (event.key) {
      case 'ArrowUp':
        focusYear(year - verticalDirection);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusYear(year + verticalDirection);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusYear(year - horizontalDirection);
        event.preventDefault();
        break;
      case 'ArrowRight':
        focusYear(year + horizontalDirection);
        event.preventDefault();
        break;
      default:
        break;
    }
  });
  const handleYearFocus = useEventCallback_default((event, year) => {
    focusYear(year);
  });
  const handleYearBlur = useEventCallback_default((event, year) => {
    if (focusedYear === year) {
      changeHasFocus(false);
    }
  });
  const scrollerRef = React32.useRef(null);
  const handleRef = useForkRef(ref, scrollerRef);
  React32.useEffect(() => {
    if (autoFocus || scrollerRef.current === null) {
      return;
    }
    const tabbableButton = scrollerRef.current.querySelector('[tabindex="0"]');
    if (!tabbableButton) {
      return;
    }
    const offsetHeight = tabbableButton.offsetHeight;
    const offsetTop = tabbableButton.offsetTop;
    const clientHeight = scrollerRef.current.clientHeight;
    const scrollTop = scrollerRef.current.scrollTop;
    const elementBottom = offsetTop + offsetHeight;
    if (offsetHeight > clientHeight || offsetTop < scrollTop) {
      return;
    }
    scrollerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
  }, [autoFocus]);
  const yearRange = utils.getYearRange([minDate, maxDate]);
  if (yearsOrder === 'desc') {
    yearRange.reverse();
  }
  return (0, import_jsx_runtime11.jsx)(
    YearCalendarRoot,
    _extends(
      {
        ref: handleRef,
        className: clsx_default(classes.root, className),
        ownerState,
        role: 'radiogroup',
        'aria-labelledby': gridLabelId,
      },
      other,
      {
        children: yearRange.map((year) => {
          const yearNumber = utils.getYear(year);
          const isSelected = yearNumber === selectedYear;
          const isDisabled = disabled || isYearDisabled(year);
          return (0, import_jsx_runtime11.jsx)(
            PickersYear,
            {
              selected: isSelected,
              value: yearNumber,
              onClick: handleYearSelection,
              onKeyDown: handleKeyDown,
              autoFocus: internalHasFocus && yearNumber === focusedYear,
              disabled: isDisabled,
              tabIndex: yearNumber === focusedYear && !isDisabled ? 0 : -1,
              onFocus: handleYearFocus,
              onBlur: handleYearBlur,
              'aria-current': todayYear === yearNumber ? 'date' : void 0,
              yearsPerRow,
              slots,
              slotProps,
              children: utils.format(year, 'year'),
            },
            utils.format(year, 'year')
          );
        }),
      }
    )
  );
});
true
  ? (YearCalendar.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      autoFocus: import_prop_types7.default.bool,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types7.default.object,
      className: import_prop_types7.default.string,
      /**
       * The default selected value.
       * Used when the component is not controlled.
       */
      defaultValue: import_prop_types7.default.object,
      /**
       * If `true` picker is disabled
       */
      disabled: import_prop_types7.default.bool,
      /**
       * If `true`, disable values after the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disableFuture: import_prop_types7.default.bool,
      /**
       * If `true`, today's date is rendering without highlighting with circle.
       * @default false
       */
      disableHighlightToday: import_prop_types7.default.bool,
      /**
       * If `true`, disable values before the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disablePast: import_prop_types7.default.bool,
      gridLabelId: import_prop_types7.default.string,
      hasFocus: import_prop_types7.default.bool,
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
       * Callback fired when the value changes.
       * @template TDate
       * @param {TDate} value The new value.
       */
      onChange: import_prop_types7.default.func,
      onFocusedViewChange: import_prop_types7.default.func,
      onYearFocus: import_prop_types7.default.func,
      /**
       * If `true` picker is readonly
       */
      readOnly: import_prop_types7.default.bool,
      /**
       * The date used to generate the new value when both `value` and `defaultValue` are empty.
       * @default The closest valid year using the validation props, except callbacks such as `shouldDisableYear`.
       */
      referenceDate: import_prop_types7.default.object,
      /**
       * Disable specific year.
       * @template TDate
       * @param {TDate} year The year to test.
       * @returns {boolean} If `true`, the year will be disabled.
       */
      shouldDisableYear: import_prop_types7.default.func,
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
       * The selected value.
       * Used when the component is controlled.
       */
      value: import_prop_types7.default.object,
      /**
       * Years are displayed in ascending (chronological) order by default.
       * If `desc`, years are displayed in descending order.
       * @default 'asc'
       */
      yearsOrder: import_prop_types7.default.oneOf(['asc', 'desc']),
      /**
       * Years rendered per row.
       * @default 3
       */
      yearsPerRow: import_prop_types7.default.oneOf([3, 4]),
    })
  : void 0;

// node_modules/@mui/x-date-pickers/internals/hooks/useViews.js
var React33 = __toESM(require_react());
var warnedOnceNotValidView = false;
function useViews({
  onChange,
  onViewChange,
  openTo,
  view: inView,
  views,
  autoFocus,
  focusedView: inFocusedView,
  onFocusedViewChange,
}) {
  if (true) {
    if (!warnedOnceNotValidView) {
      if (inView != null && !views.includes(inView)) {
        console.warn(
          `MUI X: \`view="${inView}"\` is not a valid prop.`,
          `It must be an element of \`views=["${views.join('", "')}"]\`.`
        );
        warnedOnceNotValidView = true;
      }
      if (inView == null && openTo != null && !views.includes(openTo)) {
        console.warn(
          `MUI X: \`openTo="${openTo}"\` is not a valid prop.`,
          `It must be an element of \`views=["${views.join('", "')}"]\`.`
        );
        warnedOnceNotValidView = true;
      }
    }
  }
  const previousOpenTo = React33.useRef(openTo);
  const previousViews = React33.useRef(views);
  const defaultView = React33.useRef(views.includes(openTo) ? openTo : views[0]);
  const [view, setView] = useControlled({
    name: 'useViews',
    state: 'view',
    controlled: inView,
    default: defaultView.current,
  });
  const defaultFocusedView = React33.useRef(autoFocus ? view : null);
  const [focusedView, setFocusedView] = useControlled({
    name: 'useViews',
    state: 'focusedView',
    controlled: inFocusedView,
    default: defaultFocusedView.current,
  });
  React33.useEffect(() => {
    if (
      (previousOpenTo.current && previousOpenTo.current !== openTo) ||
      (previousViews.current &&
        previousViews.current.some((previousView2) => !views.includes(previousView2)))
    ) {
      setView(views.includes(openTo) ? openTo : views[0]);
      previousViews.current = views;
      previousOpenTo.current = openTo;
    }
  }, [openTo, setView, view, views]);
  const viewIndex = views.indexOf(view);
  const previousView = views[viewIndex - 1] ?? null;
  const nextView = views[viewIndex + 1] ?? null;
  const handleFocusedViewChange = useEventCallback_default((viewToFocus, hasFocus) => {
    if (hasFocus) {
      setFocusedView(viewToFocus);
    } else {
      setFocusedView(
        (prevFocusedView) => (viewToFocus === prevFocusedView ? null : prevFocusedView)
        // If false the blur is due to view switching
      );
    }
    onFocusedViewChange == null ? void 0 : onFocusedViewChange(viewToFocus, hasFocus);
  });
  const handleChangeView = useEventCallback_default((newView) => {
    handleFocusedViewChange(newView, true);
    if (newView === view) {
      return;
    }
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  });
  const goToNextView = useEventCallback_default(() => {
    if (nextView) {
      handleChangeView(nextView);
    }
  });
  const setValueAndGoToNextView = useEventCallback_default(
    (value, currentViewSelectionState, selectedView) => {
      const isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
      const hasMoreViews = selectedView
        ? // handles case like `DateTimePicker`, where a view might return a `finish` selection state
          // but when it's not the final view given all `views` -> overall selection state should be `partial`.
          views.indexOf(selectedView) < views.length - 1
        : Boolean(nextView);
      const globalSelectionState =
        isSelectionFinishedOnCurrentView && hasMoreViews ? 'partial' : currentViewSelectionState;
      onChange(value, globalSelectionState, selectedView);
      if (selectedView && selectedView !== view) {
        const nextViewAfterSelected = views[views.indexOf(selectedView) + 1];
        if (nextViewAfterSelected) {
          handleChangeView(nextViewAfterSelected);
        }
      } else if (isSelectionFinishedOnCurrentView) {
        goToNextView();
      }
    }
  );
  return {
    view,
    setView: handleChangeView,
    focusedView,
    setFocusedView: handleFocusedViewChange,
    nextView,
    previousView,
    // Always return up-to-date default view instead of the initial one (i.e. defaultView.current)
    defaultView: views.includes(openTo) ? openTo : views[0],
    goToNextView,
    setValueAndGoToNextView,
  };
}

// node_modules/@mui/x-date-pickers/PickersCalendarHeader/pickersCalendarHeaderClasses.js
var getPickersCalendarHeaderUtilityClass = (slot) =>
  generateUtilityClass('MuiPickersCalendarHeader', slot);
var pickersCalendarHeaderClasses = generateUtilityClasses('MuiPickersCalendarHeader', [
  'root',
  'labelContainer',
  'label',
  'switchViewButton',
  'switchViewIcon',
]);

// node_modules/@mui/x-date-pickers/PickersCalendarHeader/PickersCalendarHeader.js
var React36 = __toESM(require_react());
var import_prop_types8 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.js
var React34 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/components/PickersArrowSwitcher/pickersArrowSwitcherClasses.js
function getPickersArrowSwitcherUtilityClass(slot) {
  return generateUtilityClass('MuiPickersArrowSwitcher', slot);
}
var pickersArrowSwitcherClasses = generateUtilityClasses('MuiPickersArrowSwitcher', [
  'root',
  'spacer',
  'button',
  'previousIconButton',
  'nextIconButton',
  'leftArrowIcon',
  'rightArrowIcon',
]);

// node_modules/@mui/x-date-pickers/internals/components/PickersArrowSwitcher/PickersArrowSwitcher.js
var import_jsx_runtime12 = __toESM(require_jsx_runtime());
var _excluded11 = [
  'children',
  'className',
  'slots',
  'slotProps',
  'isNextDisabled',
  'isNextHidden',
  'onGoToNext',
  'nextLabel',
  'isPreviousDisabled',
  'isPreviousHidden',
  'onGoToPrevious',
  'previousLabel',
  'labelId',
];
var _excluded23 = ['ownerState'];
var _excluded32 = ['ownerState'];
var PickersArrowSwitcherRoot = styled_default('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
});
var PickersArrowSwitcherSpacer = styled_default('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Spacer',
  overridesResolver: (props, styles) => styles.spacer,
})(({ theme }) => ({
  width: theme.spacing(3),
}));
var PickersArrowSwitcherButton = styled_default(IconButton_default, {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Button',
  overridesResolver: (props, styles) => styles.button,
})({
  variants: [
    {
      props: {
        hidden: true,
      },
      style: {
        visibility: 'hidden',
      },
    },
  ],
});
var useUtilityClasses11 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    spacer: ['spacer'],
    button: ['button'],
    previousIconButton: ['previousIconButton'],
    nextIconButton: ['nextIconButton'],
    leftArrowIcon: ['leftArrowIcon'],
    rightArrowIcon: ['rightArrowIcon'],
  };
  return composeClasses(slots, getPickersArrowSwitcherUtilityClass, classes);
};
var PickersArrowSwitcher = React34.forwardRef(function PickersArrowSwitcher2(inProps, ref) {
  const isRtl = useRtl();
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersArrowSwitcher',
  });
  const {
      children,
      className,
      slots,
      slotProps,
      isNextDisabled,
      isNextHidden,
      onGoToNext,
      nextLabel,
      isPreviousDisabled,
      isPreviousHidden,
      onGoToPrevious,
      previousLabel,
      labelId,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded11);
  const ownerState = props;
  const classes = useUtilityClasses11(ownerState);
  const nextProps = {
    isDisabled: isNextDisabled,
    isHidden: isNextHidden,
    goTo: onGoToNext,
    label: nextLabel,
  };
  const previousProps = {
    isDisabled: isPreviousDisabled,
    isHidden: isPreviousHidden,
    goTo: onGoToPrevious,
    label: previousLabel,
  };
  const PreviousIconButton =
    (slots == null ? void 0 : slots.previousIconButton) ?? PickersArrowSwitcherButton;
  const previousIconButtonProps = useSlotProps_default({
    elementType: PreviousIconButton,
    externalSlotProps: slotProps == null ? void 0 : slotProps.previousIconButton,
    additionalProps: {
      size: 'medium',
      title: previousProps.label,
      'aria-label': previousProps.label,
      disabled: previousProps.isDisabled,
      edge: 'end',
      onClick: previousProps.goTo,
    },
    ownerState: _extends({}, ownerState, {
      hidden: previousProps.isHidden,
    }),
    className: clsx_default(classes.button, classes.previousIconButton),
  });
  const NextIconButton =
    (slots == null ? void 0 : slots.nextIconButton) ?? PickersArrowSwitcherButton;
  const nextIconButtonProps = useSlotProps_default({
    elementType: NextIconButton,
    externalSlotProps: slotProps == null ? void 0 : slotProps.nextIconButton,
    additionalProps: {
      size: 'medium',
      title: nextProps.label,
      'aria-label': nextProps.label,
      disabled: nextProps.isDisabled,
      edge: 'start',
      onClick: nextProps.goTo,
    },
    ownerState: _extends({}, ownerState, {
      hidden: nextProps.isHidden,
    }),
    className: clsx_default(classes.button, classes.nextIconButton),
  });
  const LeftArrowIcon = (slots == null ? void 0 : slots.leftArrowIcon) ?? ArrowLeftIcon;
  const _useSlotProps = useSlotProps_default({
      elementType: LeftArrowIcon,
      externalSlotProps: slotProps == null ? void 0 : slotProps.leftArrowIcon,
      additionalProps: {
        fontSize: 'inherit',
      },
      ownerState,
      className: classes.leftArrowIcon,
    }),
    leftArrowIconProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded23);
  const RightArrowIcon = (slots == null ? void 0 : slots.rightArrowIcon) ?? ArrowRightIcon;
  const _useSlotProps2 = useSlotProps_default({
      elementType: RightArrowIcon,
      externalSlotProps: slotProps == null ? void 0 : slotProps.rightArrowIcon,
      additionalProps: {
        fontSize: 'inherit',
      },
      ownerState,
      className: classes.rightArrowIcon,
    }),
    rightArrowIconProps = _objectWithoutPropertiesLoose(_useSlotProps2, _excluded32);
  return (0, import_jsx_runtime12.jsxs)(
    PickersArrowSwitcherRoot,
    _extends(
      {
        ref,
        className: clsx_default(classes.root, className),
        ownerState,
      },
      other,
      {
        children: [
          (0, import_jsx_runtime12.jsx)(
            PreviousIconButton,
            _extends({}, previousIconButtonProps, {
              children: isRtl
                ? (0, import_jsx_runtime12.jsx)(RightArrowIcon, _extends({}, rightArrowIconProps))
                : (0, import_jsx_runtime12.jsx)(LeftArrowIcon, _extends({}, leftArrowIconProps)),
            })
          ),
          children
            ? (0, import_jsx_runtime12.jsx)(Typography_default, {
                variant: 'subtitle1',
                component: 'span',
                id: labelId,
                children,
              })
            : (0, import_jsx_runtime12.jsx)(PickersArrowSwitcherSpacer, {
                className: classes.spacer,
                ownerState,
              }),
          (0, import_jsx_runtime12.jsx)(
            NextIconButton,
            _extends({}, nextIconButtonProps, {
              children: isRtl
                ? (0, import_jsx_runtime12.jsx)(LeftArrowIcon, _extends({}, leftArrowIconProps))
                : (0, import_jsx_runtime12.jsx)(RightArrowIcon, _extends({}, rightArrowIconProps)),
            })
          ),
        ],
      }
    )
  );
});

// node_modules/@mui/x-date-pickers/internals/hooks/date-helpers-hooks.js
var React35 = __toESM(require_react());
function useNextMonthDisabled(month, { disableFuture, maxDate, timezone }) {
  const utils = useUtils();
  return React35.useMemo(() => {
    const now = utils.date(void 0, timezone);
    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate
    );
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils, timezone]);
}
function usePreviousMonthDisabled(month, { disablePast, minDate, timezone }) {
  const utils = useUtils();
  return React35.useMemo(() => {
    const now = utils.date(void 0, timezone);
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate
    );
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils, timezone]);
}

// node_modules/@mui/x-date-pickers/PickersCalendarHeader/PickersCalendarHeader.js
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
var _excluded12 = [
  'slots',
  'slotProps',
  'currentMonth',
  'disabled',
  'disableFuture',
  'disablePast',
  'maxDate',
  'minDate',
  'onMonthChange',
  'onViewChange',
  'view',
  'reduceAnimations',
  'views',
  'labelId',
  'className',
  'timezone',
  'format',
];
var _excluded24 = ['ownerState'];
var useUtilityClasses12 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    labelContainer: ['labelContainer'],
    label: ['label'],
    switchViewButton: ['switchViewButton'],
    switchViewIcon: ['switchViewIcon'],
  };
  return composeClasses(slots, getPickersCalendarHeaderUtilityClass, classes);
};
var PickersCalendarHeaderRoot = styled_default('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'flex',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 4,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 40,
  minHeight: 40,
});
var PickersCalendarHeaderLabelContainer = styled_default('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'LabelContainer',
  overridesResolver: (_, styles) => styles.labelContainer,
})(({ theme }) =>
  _extends(
    {
      display: 'flex',
      overflow: 'hidden',
      alignItems: 'center',
      cursor: 'pointer',
      marginRight: 'auto',
    },
    theme.typography.body1,
    {
      fontWeight: theme.typography.fontWeightMedium,
    }
  )
);
var PickersCalendarHeaderLabel = styled_default('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})({
  marginRight: 6,
});
var PickersCalendarHeaderSwitchViewButton = styled_default(IconButton_default, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewButton',
  overridesResolver: (_, styles) => styles.switchViewButton,
})({
  marginRight: 'auto',
  variants: [
    {
      props: {
        view: 'year',
      },
      style: {
        [`.${pickersCalendarHeaderClasses.switchViewIcon}`]: {
          transform: 'rotate(180deg)',
        },
      },
    },
  ],
});
var PickersCalendarHeaderSwitchViewIcon = styled_default(ArrowDropDownIcon, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewIcon',
  overridesResolver: (_, styles) => styles.switchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
}));
var PickersCalendarHeader = React36.forwardRef(function PickersCalendarHeader2(inProps, ref) {
  const translations = usePickersTranslations();
  const utils = useUtils();
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersCalendarHeader',
  });
  const {
      slots,
      slotProps,
      currentMonth: month,
      disabled,
      disableFuture,
      disablePast,
      maxDate,
      minDate,
      onMonthChange,
      onViewChange,
      view,
      reduceAnimations,
      views,
      labelId,
      className,
      timezone,
      format = `${utils.formats.month} ${utils.formats.year}`,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded12);
  const ownerState = props;
  const classes = useUtilityClasses12(props);
  const SwitchViewButton =
    (slots == null ? void 0 : slots.switchViewButton) ?? PickersCalendarHeaderSwitchViewButton;
  const switchViewButtonProps = useSlotProps_default({
    elementType: SwitchViewButton,
    externalSlotProps: slotProps == null ? void 0 : slotProps.switchViewButton,
    additionalProps: {
      size: 'small',
      'aria-label': translations.calendarViewSwitchingButtonAriaLabel(view),
    },
    ownerState,
    className: classes.switchViewButton,
  });
  const SwitchViewIcon =
    (slots == null ? void 0 : slots.switchViewIcon) ?? PickersCalendarHeaderSwitchViewIcon;
  const _useSlotProps = useSlotProps_default({
      elementType: SwitchViewIcon,
      externalSlotProps: slotProps == null ? void 0 : slotProps.switchViewIcon,
      ownerState,
      className: classes.switchViewIcon,
    }),
    switchViewIconProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded24);
  const selectNextMonth = () => onMonthChange(utils.addMonths(month, 1), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.addMonths(month, -1), 'right');
  const isNextMonthDisabled = useNextMonthDisabled(month, {
    disableFuture,
    maxDate,
    timezone,
  });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(month, {
    disablePast,
    minDate,
    timezone,
  });
  const handleToggleView = () => {
    if (views.length === 1 || !onViewChange || disabled) {
      return;
    }
    if (views.length === 2) {
      onViewChange(views.find((el) => el !== view) || views[0]);
    } else {
      const nextIndexToOpen = views.indexOf(view) !== 0 ? 0 : 1;
      onViewChange(views[nextIndexToOpen]);
    }
  };
  if (views.length === 1 && views[0] === 'year') {
    return null;
  }
  const label = utils.formatByString(month, format);
  return (0, import_jsx_runtime13.jsxs)(
    PickersCalendarHeaderRoot,
    _extends({}, other, {
      ownerState,
      className: clsx_default(classes.root, className),
      ref,
      children: [
        (0, import_jsx_runtime13.jsxs)(PickersCalendarHeaderLabelContainer, {
          role: 'presentation',
          onClick: handleToggleView,
          ownerState,
          'aria-live': 'polite',
          className: classes.labelContainer,
          children: [
            (0, import_jsx_runtime13.jsx)(PickersFadeTransitionGroup, {
              reduceAnimations,
              transKey: label,
              children: (0, import_jsx_runtime13.jsx)(PickersCalendarHeaderLabel, {
                id: labelId,
                ownerState,
                className: classes.label,
                children: label,
              }),
            }),
            views.length > 1 &&
              !disabled &&
              (0, import_jsx_runtime13.jsx)(
                SwitchViewButton,
                _extends({}, switchViewButtonProps, {
                  children: (0, import_jsx_runtime13.jsx)(
                    SwitchViewIcon,
                    _extends({}, switchViewIconProps)
                  ),
                })
              ),
          ],
        }),
        (0, import_jsx_runtime13.jsx)(Fade_default, {
          in: view === 'day',
          appear: !reduceAnimations,
          enter: !reduceAnimations,
          children: (0, import_jsx_runtime13.jsx)(PickersArrowSwitcher, {
            slots,
            slotProps,
            onGoToPrevious: selectPreviousMonth,
            isPreviousDisabled: isPreviousMonthDisabled,
            previousLabel: translations.previousMonth,
            onGoToNext: selectNextMonth,
            isNextDisabled: isNextMonthDisabled,
            nextLabel: translations.nextMonth,
          }),
        }),
      ],
    })
  );
});
true
  ? (PickersCalendarHeader.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types8.default.object,
      className: import_prop_types8.default.string,
      currentMonth: import_prop_types8.default.object.isRequired,
      disabled: import_prop_types8.default.bool,
      disableFuture: import_prop_types8.default.bool,
      disablePast: import_prop_types8.default.bool,
      /**
       * Format used to display the date.
       * @default `${adapter.formats.month} ${adapter.formats.year}`
       */
      format: import_prop_types8.default.string,
      /**
       * Id of the calendar text element.
       * It is used to establish an `aria-labelledby` relationship with the calendar `grid` element.
       */
      labelId: import_prop_types8.default.string,
      maxDate: import_prop_types8.default.object.isRequired,
      minDate: import_prop_types8.default.object.isRequired,
      onMonthChange: import_prop_types8.default.func.isRequired,
      onViewChange: import_prop_types8.default.func,
      reduceAnimations: import_prop_types8.default.bool.isRequired,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types8.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types8.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types8.default.oneOfType([
        import_prop_types8.default.arrayOf(
          import_prop_types8.default.oneOfType([
            import_prop_types8.default.func,
            import_prop_types8.default.object,
            import_prop_types8.default.bool,
          ])
        ),
        import_prop_types8.default.func,
        import_prop_types8.default.object,
      ]),
      timezone: import_prop_types8.default.string.isRequired,
      view: import_prop_types8.default.oneOf(['day', 'month', 'year']).isRequired,
      views: import_prop_types8.default.arrayOf(
        import_prop_types8.default.oneOf(['day', 'month', 'year']).isRequired
      ).isRequired,
    })
  : void 0;

// node_modules/@mui/x-date-pickers/internals/components/PickerViewRoot/PickerViewRoot.js
var PickerViewRoot = styled_default('div')({
  overflow: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
});

// node_modules/@mui/x-date-pickers/internals/hooks/useDefaultReduceAnimations.js
var PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';
var mobileVersionMatches =
  typeof navigator !== 'undefined' && navigator.userAgent.match(/android\s(\d+)|OS\s(\d+)/i);
var androidVersion =
  mobileVersionMatches && mobileVersionMatches[1] ? parseInt(mobileVersionMatches[1], 10) : null;
var iOSVersion =
  mobileVersionMatches && mobileVersionMatches[2] ? parseInt(mobileVersionMatches[2], 10) : null;
var slowAnimationDevices =
  (androidVersion && androidVersion < 10) || (iOSVersion && iOSVersion < 13) || false;
var useDefaultReduceAnimations = () => {
  const prefersReduced = useMediaQuery_default(PREFERS_REDUCED_MOTION, {
    defaultMatches: false,
  });
  return prefersReduced || slowAnimationDevices;
};

// node_modules/@mui/x-date-pickers/DateCalendar/dateCalendarClasses.js
var getDateCalendarUtilityClass = (slot) => generateUtilityClass('MuiDateCalendar', slot);
var dateCalendarClasses = generateUtilityClasses('MuiDateCalendar', [
  'root',
  'viewTransitionContainer',
]);

// node_modules/@mui/x-date-pickers/DateCalendar/DateCalendar.js
var import_jsx_runtime14 = __toESM(require_jsx_runtime());
var _excluded13 = [
  'autoFocus',
  'onViewChange',
  'value',
  'defaultValue',
  'referenceDate',
  'disableFuture',
  'disablePast',
  'onChange',
  'onYearChange',
  'onMonthChange',
  'reduceAnimations',
  'shouldDisableDate',
  'shouldDisableMonth',
  'shouldDisableYear',
  'view',
  'views',
  'openTo',
  'className',
  'disabled',
  'readOnly',
  'minDate',
  'maxDate',
  'disableHighlightToday',
  'focusedView',
  'onFocusedViewChange',
  'showDaysOutsideCurrentMonth',
  'fixedWeekNumber',
  'dayOfWeekFormatter',
  'slots',
  'slotProps',
  'loading',
  'renderLoading',
  'displayWeekNumber',
  'yearsOrder',
  'yearsPerRow',
  'monthsPerRow',
  'timezone',
];
var useUtilityClasses13 = (ownerState) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    viewTransitionContainer: ['viewTransitionContainer'],
  };
  return composeClasses(slots, getDateCalendarUtilityClass, classes);
};
function useDateCalendarDefaultizedProps(props, name) {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const defaultReduceAnimations = useDefaultReduceAnimations();
  const themeProps = useThemeProps({
    props,
    name,
  });
  return _extends({}, themeProps, {
    loading: themeProps.loading ?? false,
    disablePast: themeProps.disablePast ?? false,
    disableFuture: themeProps.disableFuture ?? false,
    openTo: themeProps.openTo ?? 'day',
    views: themeProps.views ?? ['year', 'day'],
    reduceAnimations: themeProps.reduceAnimations ?? defaultReduceAnimations,
    renderLoading:
      themeProps.renderLoading ??
      (() =>
        (0, import_jsx_runtime14.jsx)('span', {
          children: '...',
        })),
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  });
}
var DateCalendarRoot = styled_default(PickerViewRoot, {
  name: 'MuiDateCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'column',
  height: VIEW_HEIGHT,
});
var DateCalendarViewTransitionContainer = styled_default(PickersFadeTransitionGroup, {
  name: 'MuiDateCalendar',
  slot: 'ViewTransitionContainer',
  overridesResolver: (props, styles) => styles.viewTransitionContainer,
})({});
var DateCalendar = React37.forwardRef(function DateCalendar2(inProps, ref) {
  const utils = useUtils();
  const id = useId();
  const props = useDateCalendarDefaultizedProps(inProps, 'MuiDateCalendar');
  const {
      autoFocus,
      onViewChange,
      value: valueProp,
      defaultValue,
      referenceDate: referenceDateProp,
      disableFuture,
      disablePast,
      onChange,
      onYearChange,
      onMonthChange,
      reduceAnimations,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      view: inView,
      views,
      openTo,
      className,
      disabled,
      readOnly,
      minDate,
      maxDate,
      disableHighlightToday,
      focusedView: inFocusedView,
      onFocusedViewChange,
      showDaysOutsideCurrentMonth,
      fixedWeekNumber,
      dayOfWeekFormatter,
      slots,
      slotProps,
      loading,
      renderLoading,
      displayWeekNumber,
      yearsOrder,
      yearsPerRow,
      monthsPerRow,
      timezone: timezoneProp,
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded13);
  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'DateCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });
  const { view, setView, focusedView, setFocusedView, goToNextView, setValueAndGoToNextView } =
    useViews({
      view: inView,
      views,
      openTo,
      onChange: handleValueChange,
      onViewChange,
      autoFocus,
      focusedView: inFocusedView,
      onFocusedViewChange,
    });
  const {
    referenceDate,
    calendarState,
    changeFocusedDay,
    changeMonth,
    handleChangeMonth,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    value,
    referenceDate: referenceDateProp,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
    timezone,
  });
  const minDateWithDisabled = (disabled && value) || minDate;
  const maxDateWithDisabled = (disabled && value) || maxDate;
  const gridLabelId = `${id}-grid-label`;
  const hasFocus = focusedView !== null;
  const CalendarHeader = (slots == null ? void 0 : slots.calendarHeader) ?? PickersCalendarHeader;
  const calendarHeaderProps = useSlotProps_default({
    elementType: CalendarHeader,
    externalSlotProps: slotProps == null ? void 0 : slotProps.calendarHeader,
    additionalProps: {
      views,
      view,
      currentMonth: calendarState.currentMonth,
      onViewChange: setView,
      onMonthChange: (newMonth, direction) =>
        handleChangeMonth({
          newMonth,
          direction,
        }),
      minDate: minDateWithDisabled,
      maxDate: maxDateWithDisabled,
      disabled,
      disablePast,
      disableFuture,
      reduceAnimations,
      timezone,
      labelId: gridLabelId,
    },
    ownerState: props,
  });
  const handleDateMonthChange = useEventCallback_default((newDate) => {
    const startOfMonth = utils.startOfMonth(newDate);
    const endOfMonth = utils.endOfMonth(newDate);
    const closestEnabledDate = isDateDisabled(newDate)
      ? findClosestEnabledDate({
          utils,
          date: newDate,
          minDate: utils.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
          maxDate: utils.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        })
      : newDate;
    if (closestEnabledDate) {
      setValueAndGoToNextView(closestEnabledDate, 'finish');
      onMonthChange == null ? void 0 : onMonthChange(startOfMonth);
    } else {
      goToNextView();
      changeMonth(startOfMonth);
    }
    changeFocusedDay(closestEnabledDate, true);
  });
  const handleDateYearChange = useEventCallback_default((newDate) => {
    const startOfYear = utils.startOfYear(newDate);
    const endOfYear = utils.endOfYear(newDate);
    const closestEnabledDate = isDateDisabled(newDate)
      ? findClosestEnabledDate({
          utils,
          date: newDate,
          minDate: utils.isBefore(minDate, startOfYear) ? startOfYear : minDate,
          maxDate: utils.isAfter(maxDate, endOfYear) ? endOfYear : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        })
      : newDate;
    if (closestEnabledDate) {
      setValueAndGoToNextView(closestEnabledDate, 'finish');
      onYearChange == null ? void 0 : onYearChange(closestEnabledDate);
    } else {
      goToNextView();
      changeMonth(startOfYear);
    }
    changeFocusedDay(closestEnabledDate, true);
  });
  const handleSelectedDayChange = useEventCallback_default((day) => {
    if (day) {
      return handleValueChange(
        mergeDateAndTime(utils, day, value ?? referenceDate),
        'finish',
        view
      );
    }
    return handleValueChange(day, 'finish', view);
  });
  React37.useEffect(() => {
    if (value != null && utils.isValid(value)) {
      changeMonth(value);
    }
  }, [value]);
  const ownerState = props;
  const classes = useUtilityClasses13(ownerState);
  const baseDateValidationProps = {
    disablePast,
    disableFuture,
    maxDate,
    minDate,
  };
  const commonViewProps = {
    disableHighlightToday,
    readOnly,
    disabled,
    timezone,
    gridLabelId,
    slots,
    slotProps,
  };
  const prevOpenViewRef = React37.useRef(view);
  React37.useEffect(() => {
    if (prevOpenViewRef.current === view) {
      return;
    }
    if (focusedView === prevOpenViewRef.current) {
      setFocusedView(view, true);
    }
    prevOpenViewRef.current = view;
  }, [focusedView, setFocusedView, view]);
  const selectedDays = React37.useMemo(() => [value], [value]);
  return (0, import_jsx_runtime14.jsxs)(
    DateCalendarRoot,
    _extends(
      {
        ref,
        className: clsx_default(classes.root, className),
        ownerState,
      },
      other,
      {
        children: [
          (0, import_jsx_runtime14.jsx)(
            CalendarHeader,
            _extends({}, calendarHeaderProps, {
              slots,
              slotProps,
            })
          ),
          (0, import_jsx_runtime14.jsx)(DateCalendarViewTransitionContainer, {
            reduceAnimations,
            className: classes.viewTransitionContainer,
            transKey: view,
            ownerState,
            children: (0, import_jsx_runtime14.jsxs)('div', {
              children: [
                view === 'year' &&
                  (0, import_jsx_runtime14.jsx)(
                    YearCalendar,
                    _extends({}, baseDateValidationProps, commonViewProps, {
                      value,
                      onChange: handleDateYearChange,
                      shouldDisableYear,
                      hasFocus,
                      onFocusedViewChange: (isViewFocused) => setFocusedView('year', isViewFocused),
                      yearsOrder,
                      yearsPerRow,
                      referenceDate,
                    })
                  ),
                view === 'month' &&
                  (0, import_jsx_runtime14.jsx)(
                    MonthCalendar,
                    _extends({}, baseDateValidationProps, commonViewProps, {
                      hasFocus,
                      className,
                      value,
                      onChange: handleDateMonthChange,
                      shouldDisableMonth,
                      onFocusedViewChange: (isViewFocused) =>
                        setFocusedView('month', isViewFocused),
                      monthsPerRow,
                      referenceDate,
                    })
                  ),
                view === 'day' &&
                  (0, import_jsx_runtime14.jsx)(
                    DayCalendar,
                    _extends({}, calendarState, baseDateValidationProps, commonViewProps, {
                      onMonthSwitchingAnimationEnd,
                      onFocusedDayChange: changeFocusedDay,
                      reduceAnimations,
                      selectedDays,
                      onSelectedDaysChange: handleSelectedDayChange,
                      shouldDisableDate,
                      shouldDisableMonth,
                      shouldDisableYear,
                      hasFocus,
                      onFocusedViewChange: (isViewFocused) => setFocusedView('day', isViewFocused),
                      showDaysOutsideCurrentMonth,
                      fixedWeekNumber,
                      dayOfWeekFormatter,
                      displayWeekNumber,
                      loading,
                      renderLoading,
                    })
                  ),
              ],
            }),
          }),
        ],
      }
    )
  );
});
true
  ? (DateCalendar.propTypes = {
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
      autoFocus: import_prop_types9.default.bool,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types9.default.object,
      className: import_prop_types9.default.string,
      /**
       * Formats the day of week displayed in the calendar header.
       * @param {TDate} date The date of the day of week provided by the adapter.
       * @returns {string} The name to display.
       * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
       */
      dayOfWeekFormatter: import_prop_types9.default.func,
      /**
       * The default selected value.
       * Used when the component is not controlled.
       */
      defaultValue: import_prop_types9.default.object,
      /**
       * If `true`, the picker and text field are disabled.
       * @default false
       */
      disabled: import_prop_types9.default.bool,
      /**
       * If `true`, disable values after the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disableFuture: import_prop_types9.default.bool,
      /**
       * If `true`, today's date is rendering without highlighting with circle.
       * @default false
       */
      disableHighlightToday: import_prop_types9.default.bool,
      /**
       * If `true`, disable values before the current date for date components, time for time components and both for date time components.
       * @default false
       */
      disablePast: import_prop_types9.default.bool,
      /**
       * If `true`, the week number will be display in the calendar.
       */
      displayWeekNumber: import_prop_types9.default.bool,
      /**
       * The day view will show as many weeks as needed after the end of the current month to match this value.
       * Put it to 6 to have a fixed number of weeks in Gregorian calendars
       */
      fixedWeekNumber: import_prop_types9.default.number,
      /**
       * Controlled focused view.
       */
      focusedView: import_prop_types9.default.oneOf(['day', 'month', 'year']),
      /**
       * If `true`, calls `renderLoading` instead of rendering the day calendar.
       * Can be used to preload information and show it in calendar.
       * @default false
       */
      loading: import_prop_types9.default.bool,
      /**
       * Maximal selectable date.
       * @default 2099-12-31
       */
      maxDate: import_prop_types9.default.object,
      /**
       * Minimal selectable date.
       * @default 1900-01-01
       */
      minDate: import_prop_types9.default.object,
      /**
       * Months rendered per row.
       * @default 3
       */
      monthsPerRow: import_prop_types9.default.oneOf([3, 4]),
      /**
       * Callback fired when the value changes.
       * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
       * @template TView The view type. Will be one of date or time views.
       * @param {TValue} value The new value.
       * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
       * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
       */
      onChange: import_prop_types9.default.func,
      /**
       * Callback fired on focused view change.
       * @template TView
       * @param {TView} view The new view to focus or not.
       * @param {boolean} hasFocus `true` if the view should be focused.
       */
      onFocusedViewChange: import_prop_types9.default.func,
      /**
       * Callback fired on month change.
       * @template TDate
       * @param {TDate} month The new month.
       */
      onMonthChange: import_prop_types9.default.func,
      /**
       * Callback fired on view change.
       * @template TView
       * @param {TView} view The new view.
       */
      onViewChange: import_prop_types9.default.func,
      /**
       * Callback fired on year change.
       * @template TDate
       * @param {TDate} year The new year.
       */
      onYearChange: import_prop_types9.default.func,
      /**
       * The default visible view.
       * Used when the component view is not controlled.
       * Must be a valid option from `views` list.
       */
      openTo: import_prop_types9.default.oneOf(['day', 'month', 'year']),
      /**
       * Make picker read only.
       * @default false
       */
      readOnly: import_prop_types9.default.bool,
      /**
       * If `true`, disable heavy animations.
       * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
       */
      reduceAnimations: import_prop_types9.default.bool,
      /**
       * The date used to generate the new value when both `value` and `defaultValue` are empty.
       * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
       */
      referenceDate: import_prop_types9.default.object,
      /**
       * Component displaying when passed `loading` true.
       * @returns {React.ReactNode} The node to render when loading.
       * @default () => <span>...</span>
       */
      renderLoading: import_prop_types9.default.func,
      /**
       * Disable specific date.
       *
       * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
       *
       * @template TDate
       * @param {TDate} day The date to test.
       * @returns {boolean} If `true` the date will be disabled.
       */
      shouldDisableDate: import_prop_types9.default.func,
      /**
       * Disable specific month.
       * @template TDate
       * @param {TDate} month The month to test.
       * @returns {boolean} If `true`, the month will be disabled.
       */
      shouldDisableMonth: import_prop_types9.default.func,
      /**
       * Disable specific year.
       * @template TDate
       * @param {TDate} year The year to test.
       * @returns {boolean} If `true`, the year will be disabled.
       */
      shouldDisableYear: import_prop_types9.default.func,
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
      showDaysOutsideCurrentMonth: import_prop_types9.default.bool,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types9.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types9.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types9.default.oneOfType([
        import_prop_types9.default.arrayOf(
          import_prop_types9.default.oneOfType([
            import_prop_types9.default.func,
            import_prop_types9.default.object,
            import_prop_types9.default.bool,
          ])
        ),
        import_prop_types9.default.func,
        import_prop_types9.default.object,
      ]),
      /**
       * Choose which timezone to use for the value.
       * Example: "default", "system", "UTC", "America/New_York".
       * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
       * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
       * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
       */
      timezone: import_prop_types9.default.string,
      /**
       * The selected value.
       * Used when the component is controlled.
       */
      value: import_prop_types9.default.object,
      /**
       * The visible view.
       * Used when the component view is controlled.
       * Must be a valid option from `views` list.
       */
      view: import_prop_types9.default.oneOf(['day', 'month', 'year']),
      /**
       * Available views.
       */
      views: import_prop_types9.default.arrayOf(
        import_prop_types9.default.oneOf(['day', 'month', 'year']).isRequired
      ),
      /**
       * Years are displayed in ascending (chronological) order by default.
       * If `desc`, years are displayed in descending order.
       * @default 'asc'
       */
      yearsOrder: import_prop_types9.default.oneOf(['asc', 'desc']),
      /**
       * Years rendered per row.
       * @default 3
       */
      yearsPerRow: import_prop_types9.default.oneOf([3, 4]),
    })
  : void 0;

// node_modules/@mui/x-date-pickers/dateViewRenderers/dateViewRenderers.js
var import_jsx_runtime15 = __toESM(require_jsx_runtime());
var renderDateViewCalendar = ({
  view,
  onViewChange,
  views,
  focusedView,
  onFocusedViewChange,
  value,
  defaultValue,
  referenceDate,
  onChange,
  className,
  classes,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  reduceAnimations,
  onMonthChange,
  monthsPerRow,
  onYearChange,
  yearsOrder,
  yearsPerRow,
  slots,
  slotProps,
  loading,
  renderLoading,
  disableHighlightToday,
  readOnly,
  disabled,
  showDaysOutsideCurrentMonth,
  dayOfWeekFormatter,
  sx,
  autoFocus,
  fixedWeekNumber,
  displayWeekNumber,
  timezone,
}) =>
  (0, import_jsx_runtime15.jsx)(DateCalendar, {
    view,
    onViewChange,
    views: views.filter(isDatePickerView),
    focusedView: focusedView && isDatePickerView(focusedView) ? focusedView : null,
    onFocusedViewChange,
    value,
    defaultValue,
    referenceDate,
    onChange,
    className,
    classes,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    reduceAnimations,
    onMonthChange,
    monthsPerRow,
    onYearChange,
    yearsOrder,
    yearsPerRow,
    slots,
    slotProps,
    loading,
    renderLoading,
    disableHighlightToday,
    readOnly,
    disabled,
    showDaysOutsideCurrentMonth,
    dayOfWeekFormatter,
    sx,
    autoFocus,
    fixedWeekNumber,
    displayWeekNumber,
    timezone,
  });

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.js
var React40 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/internals/hooks/useOpenState.js
var React39 = __toESM(require_react());
var useOpenState = ({ open, onOpen, onClose }) => {
  const isControllingOpenProp = React39.useRef(typeof open === 'boolean').current;
  const [openState, setIsOpenState] = React39.useState(false);
  React39.useEffect(() => {
    if (isControllingOpenProp) {
      if (typeof open !== 'boolean') {
        throw new Error('You must not mix controlling and uncontrolled mode for `open` prop');
      }
      setIsOpenState(open);
    }
  }, [isControllingOpenProp, open]);
  const setIsOpen = React39.useCallback(
    (newIsOpen) => {
      if (!isControllingOpenProp) {
        setIsOpenState(newIsOpen);
      }
      if (newIsOpen && onOpen) {
        onOpen();
      }
      if (!newIsOpen && onClose) {
        onClose();
      }
    },
    [isControllingOpenProp, onOpen, onClose]
  );
  return {
    isOpen: openState,
    setIsOpen,
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.js
var shouldPublishValue = (params) => {
  const { action, hasChanged, dateState, isControlled } = params;
  const isCurrentValueTheDefaultValue = !isControlled && !dateState.hasBeenModifiedSinceMount;
  if (action.name === 'setValueFromField') {
    return true;
  }
  if (action.name === 'setValueFromAction') {
    if (
      isCurrentValueTheDefaultValue &&
      ['accept', 'today', 'clear'].includes(action.pickerAction)
    ) {
      return true;
    }
    return hasChanged(dateState.lastPublishedValue);
  }
  if (action.name === 'setValueFromView' && action.selectionState !== 'shallow') {
    if (isCurrentValueTheDefaultValue) {
      return true;
    }
    return hasChanged(dateState.lastPublishedValue);
  }
  if (action.name === 'setValueFromShortcut') {
    if (isCurrentValueTheDefaultValue) {
      return true;
    }
    return hasChanged(dateState.lastPublishedValue);
  }
  return false;
};
var shouldCommitValue = (params) => {
  const { action, hasChanged, dateState, isControlled, closeOnSelect } = params;
  const isCurrentValueTheDefaultValue = !isControlled && !dateState.hasBeenModifiedSinceMount;
  if (action.name === 'setValueFromAction') {
    if (
      isCurrentValueTheDefaultValue &&
      ['accept', 'today', 'clear'].includes(action.pickerAction)
    ) {
      return true;
    }
    return hasChanged(dateState.lastCommittedValue);
  }
  if (action.name === 'setValueFromView' && action.selectionState === 'finish' && closeOnSelect) {
    if (isCurrentValueTheDefaultValue) {
      return true;
    }
    return hasChanged(dateState.lastCommittedValue);
  }
  if (action.name === 'setValueFromShortcut') {
    return action.changeImportance === 'accept' && hasChanged(dateState.lastCommittedValue);
  }
  return false;
};
var shouldClosePicker = (params) => {
  const { action, closeOnSelect } = params;
  if (action.name === 'setValueFromAction') {
    return true;
  }
  if (action.name === 'setValueFromView') {
    return action.selectionState === 'finish' && closeOnSelect;
  }
  if (action.name === 'setValueFromShortcut') {
    return action.changeImportance === 'accept';
  }
  return false;
};
var usePickerValue = ({
  props,
  valueManager,
  valueType,
  wrapperVariant,
  validator: validator2,
}) => {
  const {
    onAccept,
    onChange,
    value: inValueWithoutRenderTimezone,
    defaultValue: inDefaultValue,
    closeOnSelect = wrapperVariant === 'desktop',
    timezone: timezoneProp,
    referenceDate,
  } = props;
  const { current: defaultValue } = React40.useRef(inDefaultValue);
  const { current: isControlled } = React40.useRef(inValueWithoutRenderTimezone !== void 0);
  const [previousTimezoneProp, setPreviousTimezoneProp] = React40.useState(timezoneProp);
  if (true) {
    React40.useEffect(() => {
      if (isControlled !== (inValueWithoutRenderTimezone !== void 0)) {
        console.error(
          [
            `MUI X: A component is changing the ${isControlled ? '' : 'un'}controlled value of a picker to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled valuefor the lifetime of the component.`,
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n')
        );
      }
    }, [inValueWithoutRenderTimezone]);
    React40.useEffect(() => {
      if (!isControlled && defaultValue !== inDefaultValue) {
        console.error(
          [
            `MUI X: A component is changing the defaultValue of an uncontrolled picker after being initialized. To suppress this warning opt to use a controlled value.`,
          ].join('\n')
        );
      }
    }, [JSON.stringify(defaultValue)]);
  }
  const utils = useUtils();
  const adapter = useLocalizationContext();
  const { isOpen, setIsOpen } = useOpenState(props);
  const {
    timezone,
    value: inValueWithTimezoneToRender,
    handleValueChange,
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: inValueWithoutRenderTimezone,
    defaultValue,
    referenceDate,
    onChange,
    valueManager,
  });
  const [dateState, setDateState] = React40.useState(() => {
    let initialValue;
    if (inValueWithTimezoneToRender !== void 0) {
      initialValue = inValueWithTimezoneToRender;
    } else if (defaultValue !== void 0) {
      initialValue = defaultValue;
    } else {
      initialValue = valueManager.emptyValue;
    }
    return {
      draft: initialValue,
      lastPublishedValue: initialValue,
      lastCommittedValue: initialValue,
      lastControlledValue: inValueWithoutRenderTimezone,
      hasBeenModifiedSinceMount: false,
    };
  });
  const timezoneFromDraftValue = valueManager.getTimezone(utils, dateState.draft);
  if (previousTimezoneProp !== timezoneProp) {
    setPreviousTimezoneProp(timezoneProp);
    if (timezoneProp && timezoneFromDraftValue && timezoneProp !== timezoneFromDraftValue) {
      setDateState((prev) =>
        _extends({}, prev, {
          draft: valueManager.setTimezone(utils, timezoneProp, prev.draft),
        })
      );
    }
  }
  const { getValidationErrorForNewValue } = useValidation({
    props,
    validator: validator2,
    timezone,
    value: dateState.draft,
    onError: props.onError,
  });
  const updateDate = useEventCallback_default((action) => {
    const updaterParams = {
      action,
      dateState,
      hasChanged: (comparison) => !valueManager.areValuesEqual(utils, action.value, comparison),
      isControlled,
      closeOnSelect,
    };
    const shouldPublish = shouldPublishValue(updaterParams);
    const shouldCommit = shouldCommitValue(updaterParams);
    const shouldClose = shouldClosePicker(updaterParams);
    setDateState((prev) =>
      _extends({}, prev, {
        draft: action.value,
        lastPublishedValue: shouldPublish ? action.value : prev.lastPublishedValue,
        lastCommittedValue: shouldCommit ? action.value : prev.lastCommittedValue,
        hasBeenModifiedSinceMount: true,
      })
    );
    let cachedContext = null;
    const getContext = () => {
      if (!cachedContext) {
        const validationError =
          action.name === 'setValueFromField'
            ? action.context.validationError
            : getValidationErrorForNewValue(action.value);
        cachedContext = {
          validationError,
        };
        if (action.name === 'setValueFromShortcut') {
          cachedContext.shortcut = action.shortcut;
        }
      }
      return cachedContext;
    };
    if (shouldPublish) {
      handleValueChange(action.value, getContext());
    }
    if (shouldCommit && onAccept) {
      onAccept(action.value, getContext());
    }
    if (shouldClose) {
      setIsOpen(false);
    }
  });
  if (dateState.lastControlledValue !== inValueWithoutRenderTimezone) {
    const isUpdateComingFromPicker = valueManager.areValuesEqual(
      utils,
      dateState.draft,
      inValueWithTimezoneToRender
    );
    setDateState((prev) =>
      _extends(
        {},
        prev,
        {
          lastControlledValue: inValueWithoutRenderTimezone,
        },
        isUpdateComingFromPicker
          ? {}
          : {
              lastCommittedValue: inValueWithTimezoneToRender,
              lastPublishedValue: inValueWithTimezoneToRender,
              draft: inValueWithTimezoneToRender,
              hasBeenModifiedSinceMount: true,
            }
      )
    );
  }
  const handleClear = useEventCallback_default(() => {
    updateDate({
      value: valueManager.emptyValue,
      name: 'setValueFromAction',
      pickerAction: 'clear',
    });
  });
  const handleAccept = useEventCallback_default(() => {
    updateDate({
      value: dateState.lastPublishedValue,
      name: 'setValueFromAction',
      pickerAction: 'accept',
    });
  });
  const handleDismiss = useEventCallback_default(() => {
    updateDate({
      value: dateState.lastPublishedValue,
      name: 'setValueFromAction',
      pickerAction: 'dismiss',
    });
  });
  const handleCancel = useEventCallback_default(() => {
    updateDate({
      value: dateState.lastCommittedValue,
      name: 'setValueFromAction',
      pickerAction: 'cancel',
    });
  });
  const handleSetToday = useEventCallback_default(() => {
    updateDate({
      value: valueManager.getTodayValue(utils, timezone, valueType),
      name: 'setValueFromAction',
      pickerAction: 'today',
    });
  });
  const handleOpen = useEventCallback_default((event) => {
    event.preventDefault();
    setIsOpen(true);
  });
  const handleClose = useEventCallback_default((event) => {
    event == null ? void 0 : event.preventDefault();
    setIsOpen(false);
  });
  const handleChange = useEventCallback_default((newValue, selectionState = 'partial') =>
    updateDate({
      name: 'setValueFromView',
      value: newValue,
      selectionState,
    })
  );
  const handleSelectShortcut = useEventCallback_default((newValue, changeImportance, shortcut) =>
    updateDate({
      name: 'setValueFromShortcut',
      value: newValue,
      changeImportance,
      shortcut,
    })
  );
  const handleChangeFromField = useEventCallback_default((newValue, context) =>
    updateDate({
      name: 'setValueFromField',
      value: newValue,
      context,
    })
  );
  const actions = {
    onClear: handleClear,
    onAccept: handleAccept,
    onDismiss: handleDismiss,
    onCancel: handleCancel,
    onSetToday: handleSetToday,
    onOpen: handleOpen,
    onClose: handleClose,
  };
  const fieldResponse = {
    value: dateState.draft,
    onChange: handleChangeFromField,
  };
  const viewValue = React40.useMemo(
    () => valueManager.cleanValue(utils, dateState.draft),
    [utils, valueManager, dateState.draft]
  );
  const viewResponse = {
    value: viewValue,
    onChange: handleChange,
    onClose: handleClose,
    open: isOpen,
  };
  const isValid = (testedValue) => {
    const error = validator2({
      adapter,
      value: testedValue,
      timezone,
      props,
    });
    return !valueManager.hasError(error);
  };
  const layoutResponse = _extends({}, actions, {
    value: viewValue,
    onChange: handleChange,
    onSelectShortcut: handleSelectShortcut,
    isValid,
  });
  const contextValue = React40.useMemo(
    () => ({
      onOpen: handleOpen,
      onClose: handleClose,
      open: isOpen,
    }),
    [isOpen, handleClose, handleOpen]
  );
  return {
    open: isOpen,
    fieldProps: fieldResponse,
    viewProps: viewResponse,
    layoutProps: layoutResponse,
    actions,
    contextValue,
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePickerViews.js
var React41 = __toESM(require_react());
var _excluded14 = ['className', 'sx'];
var usePickerViews = ({
  props,
  propsFromPickerValue,
  additionalViewProps,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
}) => {
  const { onChange, open, onClose } = propsFromPickerValue;
  const { view: inView, views, openTo, onViewChange, viewRenderers, timezone } = props;
  const propsToForwardToView = _objectWithoutPropertiesLoose(props, _excluded14);
  const { view, setView, defaultView, focusedView, setFocusedView, setValueAndGoToNextView } =
    useViews({
      view: inView,
      views,
      openTo,
      onChange,
      onViewChange,
      autoFocus: autoFocusView,
    });
  const { hasUIView, viewModeLookup } = React41.useMemo(
    () =>
      views.reduce(
        (acc, viewForReduce) => {
          let viewMode;
          if (viewRenderers[viewForReduce] != null) {
            viewMode = 'UI';
          } else {
            viewMode = 'field';
          }
          acc.viewModeLookup[viewForReduce] = viewMode;
          if (viewMode === 'UI') {
            acc.hasUIView = true;
          }
          return acc;
        },
        {
          hasUIView: false,
          viewModeLookup: {},
        }
      ),
    [viewRenderers, views]
  );
  const timeViewsCount = React41.useMemo(
    () =>
      views.reduce((acc, viewForReduce) => {
        if (viewRenderers[viewForReduce] != null && isTimeView(viewForReduce)) {
          return acc + 1;
        }
        return acc;
      }, 0),
    [viewRenderers, views]
  );
  const currentViewMode = viewModeLookup[view];
  const shouldRestoreFocus = useEventCallback_default(() => currentViewMode === 'UI');
  const [popperView, setPopperView] = React41.useState(currentViewMode === 'UI' ? view : null);
  if (popperView !== view && viewModeLookup[view] === 'UI') {
    setPopperView(view);
  }
  useEnhancedEffect_default(() => {
    if (currentViewMode === 'field' && open) {
      onClose();
      setTimeout(() => {
        var _a, _b;
        (_a = fieldRef == null ? void 0 : fieldRef.current) == null
          ? void 0
          : _a.setSelectedSections(view);
        (_b = fieldRef == null ? void 0 : fieldRef.current) == null ? void 0 : _b.focusField(view);
      });
    }
  }, [view]);
  useEnhancedEffect_default(() => {
    if (!open) {
      return;
    }
    let newView = view;
    if (currentViewMode === 'field' && popperView != null) {
      newView = popperView;
    }
    if (
      newView !== defaultView &&
      viewModeLookup[newView] === 'UI' &&
      viewModeLookup[defaultView] === 'UI'
    ) {
      newView = defaultView;
    }
    if (newView !== view) {
      setView(newView);
    }
    setFocusedView(newView, true);
  }, [open]);
  const layoutProps = {
    views,
    view: popperView,
    onViewChange: setView,
  };
  return {
    hasUIView,
    shouldRestoreFocus,
    layoutProps,
    renderCurrentView: () => {
      if (popperView == null) {
        return null;
      }
      const renderer = viewRenderers[popperView];
      if (renderer == null) {
        return null;
      }
      const rendererProps = _extends(
        {},
        propsToForwardToView,
        additionalViewProps,
        propsFromPickerValue,
        {
          views,
          timezone,
          onChange: setValueAndGoToNextView,
          view: popperView,
          onViewChange: setView,
          focusedView,
          onFocusedViewChange: setFocusedView,
          showViewSwitcher: timeViewsCount > 1,
          timeViewsCount,
        }
      );
      if (rendererInterceptor) {
        return rendererInterceptor(viewRenderers, popperView, rendererProps);
      }
      return renderer(rendererProps);
    },
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/useIsLandscape.js
var React42 = __toESM(require_react());
function getOrientation() {
  if (typeof window === 'undefined') {
    return 'portrait';
  }
  if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
    return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
  }
  if (window.orientation) {
    return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
  }
  return 'portrait';
}
var useIsLandscape = (views, customOrientation) => {
  const [orientation, setOrientation] = React42.useState(getOrientation);
  useEnhancedEffect_default(() => {
    const eventHandler = () => {
      setOrientation(getOrientation());
    };
    window.addEventListener('orientationchange', eventHandler);
    return () => {
      window.removeEventListener('orientationchange', eventHandler);
    };
  }, []);
  if (arrayIncludes(views, ['hours', 'minutes', 'seconds'])) {
    return false;
  }
  const orientationToUse = customOrientation || orientation;
  return orientationToUse === 'landscape';
};

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePickerLayoutProps.js
var usePickerLayoutProps = ({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  wrapperVariant,
}) => {
  const { orientation } = props;
  const isLandscape = useIsLandscape(propsFromPickerViews.views, orientation);
  const isRtl = useRtl();
  const layoutProps = _extends({}, propsFromPickerViews, propsFromPickerValue, {
    isLandscape,
    isRtl,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
  });
  return {
    layoutProps,
  };
};

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePickerOwnerState.js
var React43 = __toESM(require_react());
function usePickerOwnerState(parameters) {
  const { props, pickerValueResponse } = parameters;
  return React43.useMemo(
    () => ({
      value: pickerValueResponse.viewProps.value,
      open: pickerValueResponse.open,
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
    }),
    [pickerValueResponse.viewProps.value, pickerValueResponse.open, props.disabled, props.readOnly]
  );
}

// node_modules/@mui/x-date-pickers/internals/hooks/usePicker/usePicker.js
var usePicker = ({
  props,
  valueManager,
  valueType,
  wrapperVariant,
  additionalViewProps,
  validator: validator2,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
}) => {
  if (true) {
    if (props.renderInput != null) {
      warnOnce([
        'MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
        'You can replace it with the `textField` component slot in most cases.',
        'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
      ]);
    }
  }
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    valueType,
    wrapperVariant,
    validator: validator2,
  });
  const pickerViewsResponse = usePickerViews({
    props,
    additionalViewProps,
    autoFocusView,
    fieldRef,
    propsFromPickerValue: pickerValueResponse.viewProps,
    rendererInterceptor,
  });
  const pickerLayoutResponse = usePickerLayoutProps({
    props,
    wrapperVariant,
    propsFromPickerValue: pickerValueResponse.layoutProps,
    propsFromPickerViews: pickerViewsResponse.layoutProps,
  });
  const pickerOwnerState = usePickerOwnerState({
    props,
    pickerValueResponse,
  });
  return {
    // Picker value
    open: pickerValueResponse.open,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,
    // Picker views
    renderCurrentView: pickerViewsResponse.renderCurrentView,
    hasUIView: pickerViewsResponse.hasUIView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,
    // Picker layout
    layoutProps: pickerLayoutResponse.layoutProps,
    // Picker context
    contextValue: pickerValueResponse.contextValue,
    // Picker owner state
    ownerState: pickerOwnerState,
  };
};

// node_modules/@mui/x-date-pickers/PickersLayout/PickersLayout.js
var React47 = __toESM(require_react());
var import_prop_types12 = __toESM(require_prop_types());

// node_modules/@mui/x-date-pickers/PickersLayout/pickersLayoutClasses.js
function getPickersLayoutUtilityClass(slot) {
  return generateUtilityClass('MuiPickersLayout', slot);
}
var pickersLayoutClasses = generateUtilityClasses('MuiPickersLayout', [
  'root',
  'landscape',
  'contentWrapper',
  'toolbar',
  'actionBar',
  'tabs',
  'shortcuts',
]);

// node_modules/@mui/x-date-pickers/PickersLayout/usePickerLayout.js
var React46 = __toESM(require_react());

// node_modules/@mui/x-date-pickers/PickersActionBar/PickersActionBar.js
var React44 = __toESM(require_react());
var import_prop_types10 = __toESM(require_prop_types());
var import_jsx_runtime16 = __toESM(require_jsx_runtime());
var _excluded15 = ['onAccept', 'onClear', 'onCancel', 'onSetToday', 'actions'];
function PickersActionBar(props) {
  const { onAccept, onClear, onCancel, onSetToday, actions } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded15);
  const translations = usePickersTranslations();
  if (actions == null || actions.length === 0) {
    return null;
  }
  const buttons =
    actions == null
      ? void 0
      : actions.map((actionType) => {
          switch (actionType) {
            case 'clear':
              return (0, import_jsx_runtime16.jsx)(
                Button_default,
                {
                  onClick: onClear,
                  children: translations.clearButtonLabel,
                },
                actionType
              );
            case 'cancel':
              return (0, import_jsx_runtime16.jsx)(
                Button_default,
                {
                  onClick: onCancel,
                  children: translations.cancelButtonLabel,
                },
                actionType
              );
            case 'accept':
              return (0, import_jsx_runtime16.jsx)(
                Button_default,
                {
                  onClick: onAccept,
                  children: translations.okButtonLabel,
                },
                actionType
              );
            case 'today':
              return (0, import_jsx_runtime16.jsx)(
                Button_default,
                {
                  onClick: onSetToday,
                  children: translations.todayButtonLabel,
                },
                actionType
              );
            default:
              return null;
          }
        });
  return (0, import_jsx_runtime16.jsx)(
    DialogActions_default,
    _extends({}, other, {
      children: buttons,
    })
  );
}
true
  ? (PickersActionBar.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Ordered array of actions to display.
       * If empty, does not display that action bar.
       * @default `['cancel', 'accept']` for mobile and `[]` for desktop
       */
      actions: import_prop_types10.default.arrayOf(
        import_prop_types10.default.oneOf(['accept', 'cancel', 'clear', 'today']).isRequired
      ),
      /**
       * If `true`, the actions do not have additional margin.
       * @default false
       */
      disableSpacing: import_prop_types10.default.bool,
      onAccept: import_prop_types10.default.func.isRequired,
      onCancel: import_prop_types10.default.func.isRequired,
      onClear: import_prop_types10.default.func.isRequired,
      onSetToday: import_prop_types10.default.func.isRequired,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types10.default.oneOfType([
        import_prop_types10.default.arrayOf(
          import_prop_types10.default.oneOfType([
            import_prop_types10.default.func,
            import_prop_types10.default.object,
            import_prop_types10.default.bool,
          ])
        ),
        import_prop_types10.default.func,
        import_prop_types10.default.object,
      ]),
    })
  : void 0;

// node_modules/@mui/x-date-pickers/PickersShortcuts/PickersShortcuts.js
var React45 = __toESM(require_react());
var import_prop_types11 = __toESM(require_prop_types());
var import_jsx_runtime17 = __toESM(require_jsx_runtime());
var _excluded16 = ['items', 'changeImportance', 'isLandscape', 'onChange', 'isValid'];
var _excluded25 = ['getValue'];
function PickersShortcuts(props) {
  const { items, changeImportance = 'accept', onChange, isValid } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded16);
  if (items == null || items.length === 0) {
    return null;
  }
  const resolvedItems = items.map((_ref) => {
    let { getValue } = _ref,
      item = _objectWithoutPropertiesLoose(_ref, _excluded25);
    const newValue = getValue({
      isValid,
    });
    return _extends({}, item, {
      label: item.label,
      onClick: () => {
        onChange(newValue, changeImportance, item);
      },
      disabled: !isValid(newValue),
    });
  });
  return (0, import_jsx_runtime17.jsx)(
    List_default,
    _extends(
      {
        dense: true,
        sx: [
          {
            maxHeight: VIEW_HEIGHT,
            maxWidth: 200,
            overflow: 'auto',
          },
          ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
        ],
      },
      other,
      {
        children: resolvedItems.map((item) => {
          return (0, import_jsx_runtime17.jsx)(
            ListItem_default,
            {
              children: (0, import_jsx_runtime17.jsx)(Chip_default, _extends({}, item)),
            },
            item.id ?? item.label
          );
        }),
      }
    )
  );
}
true
  ? (PickersShortcuts.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      /**
       * Importance of the change when picking a shortcut:
       * - "accept": fires `onChange`, fires `onAccept` and closes the picker.
       * - "set": fires `onChange` but do not fire `onAccept` and does not close the picker.
       * @default "accept"
       */
      changeImportance: import_prop_types11.default.oneOf(['accept', 'set']),
      className: import_prop_types11.default.string,
      component: import_prop_types11.default.elementType,
      /**
       * If `true`, compact vertical padding designed for keyboard and mouse input is used for
       * the list and list items.
       * The prop is available to descendant components as the `dense` context.
       * @default false
       */
      dense: import_prop_types11.default.bool,
      /**
       * If `true`, vertical padding is removed from the list.
       * @default false
       */
      disablePadding: import_prop_types11.default.bool,
      isLandscape: import_prop_types11.default.bool.isRequired,
      isValid: import_prop_types11.default.func.isRequired,
      /**
       * Ordered array of shortcuts to display.
       * If empty, does not display the shortcuts.
       * @default []
       */
      items: import_prop_types11.default.arrayOf(
        import_prop_types11.default.shape({
          getValue: import_prop_types11.default.func.isRequired,
          id: import_prop_types11.default.string,
          label: import_prop_types11.default.string.isRequired,
        })
      ),
      onChange: import_prop_types11.default.func.isRequired,
      style: import_prop_types11.default.object,
      /**
       * The content of the subheader, normally `ListSubheader`.
       */
      subheader: import_prop_types11.default.node,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types11.default.oneOfType([
        import_prop_types11.default.arrayOf(
          import_prop_types11.default.oneOfType([
            import_prop_types11.default.func,
            import_prop_types11.default.object,
            import_prop_types11.default.bool,
          ])
        ),
        import_prop_types11.default.func,
        import_prop_types11.default.object,
      ]),
    })
  : void 0;

// node_modules/@mui/x-date-pickers/PickersLayout/usePickerLayout.js
var import_jsx_runtime18 = __toESM(require_jsx_runtime());
function toolbarHasView(toolbarProps) {
  return toolbarProps.view !== null;
}
var useUtilityClasses14 = (ownerState) => {
  const { classes, isLandscape } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
    toolbar: ['toolbar'],
    actionBar: ['actionBar'],
    tabs: ['tabs'],
    landscape: ['landscape'],
    shortcuts: ['shortcuts'],
  };
  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};
var usePickerLayout = (props) => {
  const {
    wrapperVariant,
    onAccept,
    onClear,
    onCancel,
    onSetToday,
    view,
    views,
    onViewChange,
    value,
    onChange,
    onSelectShortcut,
    isValid,
    isLandscape,
    disabled,
    readOnly,
    children,
    slots,
    slotProps,
    // TODO: Remove this "as" hack. It get introduced to mark `value` prop in PickersLayoutProps as not required.
    // The true type should be
    // - For pickers value: TDate | null
    // - For range pickers value: [TDate | null, TDate | null]
  } = props;
  const classes = useUtilityClasses14(props);
  const ActionBar = (slots == null ? void 0 : slots.actionBar) ?? PickersActionBar;
  const actionBarProps = useSlotProps_default({
    elementType: ActionBar,
    externalSlotProps: slotProps == null ? void 0 : slotProps.actionBar,
    additionalProps: {
      onAccept,
      onClear,
      onCancel,
      onSetToday,
      actions: wrapperVariant === 'desktop' ? [] : ['cancel', 'accept'],
    },
    className: classes.actionBar,
    ownerState: _extends({}, props, {
      wrapperVariant,
    }),
  });
  const actionBar = (0, import_jsx_runtime18.jsx)(ActionBar, _extends({}, actionBarProps));
  const Toolbar = slots == null ? void 0 : slots.toolbar;
  const toolbarProps = useSlotProps_default({
    elementType: Toolbar,
    externalSlotProps: slotProps == null ? void 0 : slotProps.toolbar,
    additionalProps: {
      isLandscape,
      onChange,
      value,
      view,
      onViewChange,
      views,
      disabled,
      readOnly,
    },
    className: classes.toolbar,
    ownerState: _extends({}, props, {
      wrapperVariant,
    }),
  });
  const toolbar =
    toolbarHasView(toolbarProps) && !!Toolbar
      ? (0, import_jsx_runtime18.jsx)(Toolbar, _extends({}, toolbarProps))
      : null;
  const content = children;
  const Tabs = slots == null ? void 0 : slots.tabs;
  const tabs =
    view && Tabs
      ? (0, import_jsx_runtime18.jsx)(
          Tabs,
          _extends(
            {
              view,
              onViewChange,
              className: classes.tabs,
            },
            slotProps == null ? void 0 : slotProps.tabs
          )
        )
      : null;
  const Shortcuts = (slots == null ? void 0 : slots.shortcuts) ?? PickersShortcuts;
  const shortcutsProps = useSlotProps_default({
    elementType: Shortcuts,
    externalSlotProps: slotProps == null ? void 0 : slotProps.shortcuts,
    additionalProps: {
      isValid,
      isLandscape,
      onChange: onSelectShortcut,
    },
    className: classes.shortcuts,
    ownerState: {
      isValid,
      isLandscape,
      onChange: onSelectShortcut,
      wrapperVariant,
    },
  });
  const shortcuts =
    view && !!Shortcuts
      ? (0, import_jsx_runtime18.jsx)(Shortcuts, _extends({}, shortcutsProps))
      : null;
  return {
    toolbar,
    content,
    tabs,
    actionBar,
    shortcuts,
  };
};
var usePickerLayout_default = usePickerLayout;

// node_modules/@mui/x-date-pickers/PickersLayout/PickersLayout.js
var import_jsx_runtime19 = __toESM(require_jsx_runtime());
var useUtilityClasses15 = (ownerState) => {
  const { isLandscape, classes } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
  };
  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};
var PickersLayoutRoot = styled_default('div', {
  name: 'MuiPickersLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
  [`& .${pickersLayoutClasses.actionBar}`]: {
    gridColumn: '1 / 4',
    gridRow: 3,
  },
  variants: [
    {
      props: {
        isLandscape: true,
      },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 1,
          gridRow: '2 / 3',
        },
        [`.${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: '2 / 4',
          gridRow: 1,
        },
      },
    },
    {
      props: {
        isLandscape: true,
        isRtl: true,
      },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 3,
        },
      },
    },
    {
      props: {
        isLandscape: false,
      },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: '2 / 4',
          gridRow: 1,
        },
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 1,
          gridRow: '2 / 3',
        },
      },
    },
    {
      props: {
        isLandscape: false,
        isRtl: true,
      },
      style: {
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 3,
        },
      },
    },
  ],
});
var PickersLayoutContentWrapper = styled_default('div', {
  name: 'MuiPickersLayout',
  slot: 'ContentWrapper',
  overridesResolver: (props, styles) => styles.contentWrapper,
})({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
});
var PickersLayout = React47.forwardRef(function PickersLayout2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersLayout',
  });
  const { toolbar, content, tabs, actionBar, shortcuts } = usePickerLayout_default(props);
  const { sx, className, isLandscape, wrapperVariant } = props;
  const classes = useUtilityClasses15(props);
  return (0, import_jsx_runtime19.jsxs)(PickersLayoutRoot, {
    ref,
    sx,
    className: clsx_default(classes.root, className),
    ownerState: props,
    children: [
      isLandscape ? shortcuts : toolbar,
      isLandscape ? toolbar : shortcuts,
      (0, import_jsx_runtime19.jsx)(PickersLayoutContentWrapper, {
        className: classes.contentWrapper,
        children:
          wrapperVariant === 'desktop'
            ? (0, import_jsx_runtime19.jsxs)(React47.Fragment, {
                children: [content, tabs],
              })
            : (0, import_jsx_runtime19.jsxs)(React47.Fragment, {
                children: [tabs, content],
              }),
      }),
      actionBar,
    ],
  });
});
true
  ? (PickersLayout.propTypes = {
      // ----------------------------- Warning --------------------------------
      // | These PropTypes are generated from the TypeScript type definitions |
      // | To update them edit the TypeScript types and run "pnpm proptypes"  |
      // ----------------------------------------------------------------------
      children: import_prop_types12.default.node,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types12.default.object,
      className: import_prop_types12.default.string,
      disabled: import_prop_types12.default.bool,
      isLandscape: import_prop_types12.default.bool.isRequired,
      /**
       * `true` if the application is in right-to-left direction.
       */
      isRtl: import_prop_types12.default.bool.isRequired,
      isValid: import_prop_types12.default.func.isRequired,
      onAccept: import_prop_types12.default.func.isRequired,
      onCancel: import_prop_types12.default.func.isRequired,
      onChange: import_prop_types12.default.func.isRequired,
      onClear: import_prop_types12.default.func.isRequired,
      onClose: import_prop_types12.default.func.isRequired,
      onDismiss: import_prop_types12.default.func.isRequired,
      onOpen: import_prop_types12.default.func.isRequired,
      onSelectShortcut: import_prop_types12.default.func.isRequired,
      onSetToday: import_prop_types12.default.func.isRequired,
      onViewChange: import_prop_types12.default.func.isRequired,
      /**
       * Force rendering in particular orientation.
       */
      orientation: import_prop_types12.default.oneOf(['landscape', 'portrait']),
      readOnly: import_prop_types12.default.bool,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: import_prop_types12.default.object,
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: import_prop_types12.default.object,
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx: import_prop_types12.default.oneOfType([
        import_prop_types12.default.arrayOf(
          import_prop_types12.default.oneOfType([
            import_prop_types12.default.func,
            import_prop_types12.default.object,
            import_prop_types12.default.bool,
          ])
        ),
        import_prop_types12.default.func,
        import_prop_types12.default.object,
      ]),
      value: import_prop_types12.default.any,
      view: import_prop_types12.default.oneOf([
        'day',
        'hours',
        'meridiem',
        'minutes',
        'month',
        'seconds',
        'year',
      ]),
      views: import_prop_types12.default.arrayOf(
        import_prop_types12.default.oneOf([
          'day',
          'hours',
          'meridiem',
          'minutes',
          'month',
          'seconds',
          'year',
        ]).isRequired
      ).isRequired,
      wrapperVariant: import_prop_types12.default.oneOf(['desktop', 'mobile']),
    })
  : void 0;

export {
  refType_default,
  capitalize,
  ownerDocument,
  useEnhancedEffect_default,
  useId,
  useControlled,
  useEventCallback_default,
  useForkRef,
  visuallyHidden_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  resolveComponentProps_default,
  useSlotProps_default,
  applyDefaultDate,
  resolveDateFormat,
  getSectionTypeGranularity,
  getDateSectionConfigFromFormatToken,
  getDaysInWeekStr,
  getLetterEditingOptions,
  getLocalizedDigits,
  removeLocalizedDigits,
  applyLocalizedDigits,
  isStringNumber,
  cleanLeadingZeros,
  cleanDigitSectionValue,
  adjustSectionValue,
  getSectionVisibleValue,
  changeSectionValueFormat,
  doesSectionFormatHaveLeadingZeros,
  getDateFromDateSections,
  getSectionsBoundaries,
  validateSections,
  mergeDateIntoReferenceDate,
  isAndroid,
  getSectionOrder,
  parseSelectedSections,
  getSectionValueText,
  getSectionValueNow,
  singleItemValueManager,
  singleItemFieldValueManager,
  buildGetOpenDialogAriaText,
  useLocalizationContext,
  useUtils,
  useDefaultDates,
  usePickersTranslations,
  datePickerToolbarClasses,
  DatePickerToolbar,
  useDatePickerDefaultizedProps,
  validateDate,
  DATE_VALIDATION_PROP_NAMES,
  TIME_VALIDATION_PROP_NAMES,
  DATE_TIME_VALIDATION_PROP_NAMES,
  extractValidationProps,
  useValidation,
  onSpaceOrEnter,
  getActiveElement,
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  useDefaultReduceAnimations,
  useValueWithTimezone,
  usePicker,
  DIALOG_WIDTH,
  PickersLayout,
  CalendarIcon,
  ClearIcon,
  renderDateViewCalendar,
};
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (**
   * @license React
   * react-is.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@mui/utils/esm/index.js:
  (**
   * @mui/utils v7.3.7
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=chunk-ZVNT4AWO.js.map
