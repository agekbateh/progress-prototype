
;(function () {
    /**
     * Progress prototype component.
     * @constructor
     * @name Progress
     * @param {object} options - options for Constructor.
     */
    function Progress(options) {
        // Initialization
        let elem = options.elem,
            switcherAnimate = elem.querySelector('.switcher-animate'),
            switcherHidden = elem.querySelector('.switcher-hide'),
            controlValue = elem.querySelector('.controls-value'),
            progressCircle = elem.querySelector('.component__progress-circle'),
            svgCirclePath = elem.querySelector('.svg-circle__path'),
            pathLength = svgCirclePath.getTotalLength();
        const change = new Event('change');

        // Undraw stroke on start
        svgCirclePath.style.strokeDasharray = pathLength + ',' + pathLength;
        svgCirclePath.style.strokeDashoffset = Math.round(pathLength);

        // Update coordinates of SVG
        svgCirclePath.getBoundingClientRect();

        // Set transition for path
        svgCirclePath.style.transition = svgCirclePath.style.MozTransition = svgCirclePath.style.WebkitTransition = 'stroke-dashoffset 1.75s ease-in-out';

        // Flags for states
        let animateState = false,
            hiddenState = false;


        // Private function for setting new value of progress path
        function setValue(newValue) {
            // Calculate length for setting progress path
            if (newValue !== undefined && typeof newValue === 'number') {
                controlValue.value = newValue;
                controlValue.dispatchEvent(change);
            }

            let val = this.value,
                percentageOffset = pathLength / 100 * val;
            if (val > 100 || val < 0) return;
            svgCirclePath.style.strokeDashoffset = Math.round(pathLength) - percentageOffset;
        }


        // Private function for animating progress
        function animate() {
            // Calculate length for animating with value or default
            let percentageOffset = controlValue.value > 0 ?  (pathLength / 100) * controlValue.value : 0;

            if (!animateState) {
                svgCirclePath.style.strokeDashoffset = Math.round(pathLength) - percentageOffset ;
                progressCircle.classList.add('animating');
                switcherAnimate.checked = true;
                animateState = true;
                return;
            }
            animateState = false;
            progressCircle.classList.remove('animating');
            switcherAnimate.checked = false;
            svgCirclePath.style.strokeDashoffset = Math.round(pathLength) - percentageOffset  || Math.round(pathLength);
        }


        // Private function for changing hidden state
        function hidden() {
            if (!hiddenState) {
                hiddenState = true;
                switcherHidden.checked = true;
                progressCircle.classList.add('hidden');
                return;
            }
            hiddenState = false;
            switcherHidden.checked = false;
            progressCircle.classList.remove('hidden');
        }

        // Add event listeners on Progress component
        controlValue.addEventListener('change', setValue, false);
        switcherAnimate.addEventListener('click', animate, false);
        switcherHidden.addEventListener('click', hidden, false);

        /**
         * @method
         * @memberOf Progress
         * @param {string} mod - which state will be change (example: 'animated')
         * @param {string}value - can take two states 'yes' or ''
         */
        Progress.prototype.setMod = function (mod, value) {
            if (mod === 'animated' && value === 'yes') {
                animateState = false;
                animate();
            }
            if (mod === 'animated' && value === '') {
                animateState = true;
                animate();
            }
        };

        /**
         * @method
         * @memberOf Progress
         * @param {number} newValue - setting new value
         */
        Progress.prototype.setValue = function (newValue) {
            if (!newValue && typeof newValue !== 'number') return;

            controlValue.value = +newValue;
            controlValue.dispatchEvent(change);
        };

    }

    // Add to global namespace
    window.progress = new Progress({
        elem: document.querySelector('.component')
    })

})();
