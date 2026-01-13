import { getTransitionProps, reflow } from './chunk-LOZHJMDH.js';
import { ListContext_default } from './chunk-4CCMJV5S.js';
import { Transition_default } from './chunk-TA6DHASC.js';
import { useForkRef_default } from './chunk-W5JJ2X6K.js';
import { useDefaultProps } from './chunk-2KBTL2LR.js';
import { styled_default, useTheme } from './chunk-2XAE2ENI.js';
import {
  composeClasses,
  elementAcceptingRef_default,
  generateUtilityClass,
  generateUtilityClasses,
  getReactElementRef,
} from './chunk-TZHUOUWG.js';
import { require_prop_types } from './chunk-QDMWOECB.js';
import { clsx_default } from './chunk-2KHBIA62.js';
import { require_jsx_runtime } from './chunk-3UUIVEWB.js';
import { require_react } from './chunk-QJ3FMQXC.js';
import { __toESM } from './chunk-SNAQBZPT.js';

// node_modules/@mui/material/Fade/Fade.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var styles = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
};
var Fade = React.forwardRef(function Fade2(props, ref) {
  const theme = useTheme();
  const defaultTimeout = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const {
    addEndListener,
    appear = true,
    children,
    easing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = defaultTimeout,
    // eslint-disable-next-line react/prop-types
    TransitionComponent = Transition_default,
    ...other
  } = props;
  const enableStrictModeCompat = true;
  const nodeRef = React.useRef(null);
  const handleRef = useForkRef_default(nodeRef, getReactElementRef(children), ref);
  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      if (maybeIsAppearing === void 0) {
        callback(node);
      } else {
        callback(node, maybeIsAppearing);
      }
    }
  };
  const handleEntering = normalizedTransitionCallback(onEntering);
  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    reflow(node);
    const transitionProps = getTransitionProps(
      {
        style,
        timeout,
        easing,
      },
      {
        mode: 'enter',
      }
    );
    node.style.webkitTransition = theme.transitions.create('opacity', transitionProps);
    node.style.transition = theme.transitions.create('opacity', transitionProps);
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });
  const handleEntered = normalizedTransitionCallback(onEntered);
  const handleExiting = normalizedTransitionCallback(onExiting);
  const handleExit = normalizedTransitionCallback((node) => {
    const transitionProps = getTransitionProps(
      {
        style,
        timeout,
        easing,
      },
      {
        mode: 'exit',
      }
    );
    node.style.webkitTransition = theme.transitions.create('opacity', transitionProps);
    node.style.transition = theme.transitions.create('opacity', transitionProps);
    if (onExit) {
      onExit(node);
    }
  });
  const handleExited = normalizedTransitionCallback(onExited);
  const handleAddEndListener = (next) => {
    if (addEndListener) {
      addEndListener(nodeRef.current, next);
    }
  };
  return (0, import_jsx_runtime.jsx)(TransitionComponent, {
    appear,
    in: inProp,
    nodeRef: enableStrictModeCompat ? nodeRef : void 0,
    onEnter: handleEnter,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited: handleExited,
    onExiting: handleExiting,
    addEndListener: handleAddEndListener,
    timeout,
    ...other,
    children: (state, { ownerState, ...restChildProps }) => {
      return React.cloneElement(children, {
        style: {
          opacity: 0,
          visibility: state === 'exited' && !inProp ? 'hidden' : void 0,
          ...styles[state],
          ...style,
          ...children.props.style,
        },
        ref: handleRef,
        ...restChildProps,
      });
    },
  });
});
true
  ? (Fade.propTypes = {
      // ┌────────────────────────────── Warning ──────────────────────────────┐
      // │ These PropTypes are generated from the TypeScript type definitions. │
      // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
      // └─────────────────────────────────────────────────────────────────────┘
      /**
       * Add a custom transition end trigger. Called with the transitioning DOM
       * node and a done callback. Allows for more fine grained transition end
       * logic. Note: Timeouts are still used as a fallback if provided.
       */
      addEndListener: import_prop_types.default.func,
      /**
       * Perform the enter transition when it first mounts if `in` is also `true`.
       * Set this to `false` to disable this behavior.
       * @default true
       */
      appear: import_prop_types.default.bool,
      /**
       * A single child content element.
       */
      children: elementAcceptingRef_default.isRequired,
      /**
       * The transition timing function.
       * You may specify a single easing or a object containing enter and exit values.
       */
      easing: import_prop_types.default.oneOfType([
        import_prop_types.default.shape({
          enter: import_prop_types.default.string,
          exit: import_prop_types.default.string,
        }),
        import_prop_types.default.string,
      ]),
      /**
       * If `true`, the component will transition in.
       */
      in: import_prop_types.default.bool,
      /**
       * @ignore
       */
      onEnter: import_prop_types.default.func,
      /**
       * @ignore
       */
      onEntered: import_prop_types.default.func,
      /**
       * @ignore
       */
      onEntering: import_prop_types.default.func,
      /**
       * @ignore
       */
      onExit: import_prop_types.default.func,
      /**
       * @ignore
       */
      onExited: import_prop_types.default.func,
      /**
       * @ignore
       */
      onExiting: import_prop_types.default.func,
      /**
       * @ignore
       */
      style: import_prop_types.default.object,
      /**
       * The duration for the transition, in milliseconds.
       * You may specify a single timeout for all transitions, or individually with an object.
       * @default {
       *   enter: theme.transitions.duration.enteringScreen,
       *   exit: theme.transitions.duration.leavingScreen,
       * }
       */
      timeout: import_prop_types.default.oneOfType([
        import_prop_types.default.number,
        import_prop_types.default.shape({
          appear: import_prop_types.default.number,
          enter: import_prop_types.default.number,
          exit: import_prop_types.default.number,
        }),
      ]),
    })
  : void 0;
var Fade_default = Fade;

// node_modules/@mui/material/List/listClasses.js
function getListUtilityClass(slot) {
  return generateUtilityClass('MuiList', slot);
}
var listClasses = generateUtilityClasses('MuiList', ['root', 'padding', 'dense', 'subheader']);
var listClasses_default = listClasses;

// node_modules/@mui/material/List/List.js
var React2 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const { classes, disablePadding, dense, subheader } = ownerState;
  const slots = {
    root: ['root', !disablePadding && 'padding', dense && 'dense', subheader && 'subheader'],
  };
  return composeClasses(slots, getListUtilityClass, classes);
};
var ListRoot = styled_default('ul', {
  name: 'MuiList',
  slot: 'Root',
  overridesResolver: (props, styles2) => {
    const { ownerState } = props;
    return [
      styles2.root,
      !ownerState.disablePadding && styles2.padding,
      ownerState.dense && styles2.dense,
      ownerState.subheader && styles2.subheader,
    ];
  },
})({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  variants: [
    {
      props: ({ ownerState }) => !ownerState.disablePadding,
      style: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    {
      props: ({ ownerState }) => ownerState.subheader,
      style: {
        paddingTop: 0,
      },
    },
  ],
});
var List = React2.forwardRef(function List2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: 'MuiList',
  });
  const {
    children,
    className,
    component = 'ul',
    dense = false,
    disablePadding = false,
    subheader,
    ...other
  } = props;
  const context = React2.useMemo(
    () => ({
      dense,
    }),
    [dense]
  );
  const ownerState = {
    ...props,
    component,
    dense,
    disablePadding,
  };
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime2.jsx)(ListContext_default.Provider, {
    value: context,
    children: (0, import_jsx_runtime2.jsxs)(ListRoot, {
      as: component,
      className: clsx_default(classes.root, className),
      ref,
      ownerState,
      ...other,
      children: [subheader, children],
    }),
  });
});
true
  ? (List.propTypes = {
      // ┌────────────────────────────── Warning ──────────────────────────────┐
      // │ These PropTypes are generated from the TypeScript type definitions. │
      // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
      // └─────────────────────────────────────────────────────────────────────┘
      /**
       * The content of the component.
       */
      children: import_prop_types2.default.node,
      /**
       * Override or extend the styles applied to the component.
       */
      classes: import_prop_types2.default.object,
      /**
       * @ignore
       */
      className: import_prop_types2.default.string,
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: import_prop_types2.default.elementType,
      /**
       * If `true`, compact vertical padding designed for keyboard and mouse input is used for
       * the list and list items.
       * The prop is available to descendant components as the `dense` context.
       * @default false
       */
      dense: import_prop_types2.default.bool,
      /**
       * If `true`, vertical padding is removed from the list.
       * @default false
       */
      disablePadding: import_prop_types2.default.bool,
      /**
       * The content of the subheader, normally `ListSubheader`.
       */
      subheader: import_prop_types2.default.node,
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
    })
  : void 0;
var List_default = List;

export { Fade_default, getListUtilityClass, listClasses_default, List_default };
//# sourceMappingURL=chunk-4BY54NEZ.js.map
