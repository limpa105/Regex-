// This is the main typescript file that runs in the browser.
//
// (It imports stuff from the other typescript files.)

import {initJsPsych} from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import instructions from '@jspsych/plugin-instructions';
import surveyMulipleChoice from '@jspsych/plugin-survey-multi-choice';
import SurveyTextPlugin from './survey-text';
import {RegexExamplesPlugin, RegexExampleData} from './regex-examples-plugin';
import FreeSortPlugin from './drag-and-drop';

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var prolificID = urlParams.get("PROLIFIC_PID"); // ID unique to the participant
var studyID = urlParams.get("STUDY_ID"); // ID unique to the study
var sessionID = urlParams.get("SESSION_ID"); // ID unique to the particular submission
var projName = urlParams.get("projName");
var expName = urlParams.get("expName");
var iterName = urlParams.get("iterName");


var jsPsych = initJsPsych({
  /* options go here */
  on_data_update: function() {
    saveData(jsPsych.data.get().csv());
  },
  show_progress_bar: true,
  message_progress_bar: 'Journey completion',
  auto_update_progress_bar: false,
});

function saveData(data: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/have_some_data');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ prolificID, studyID, sessionID, data }));
}

/*********** The main content ***********/
/* We could change it to get the content from a server, or from somewhere else,
 * or whatever, in the future
 */
const problems: RegexExampleData[] = [
  {
    description: "All nonempty lowercase strings",
    regex: "[a-z]+",
  },
  {
    description: "All strings made up of uppercase letters, lowercase letters and digits, and that contain at least one lowercase letter",
    regex: "[A-Za-z0-9]*[a-z][A-Za-z0-9]*",
  },
  {
    description: "All strings made up of “<tt>  09 </tt> ” followed by 7 digits",
    regex: "09\\d{7}",
  },
  {
    description: "All strings made up of “<tt>Page  </tt>” followed by at least one digit followed by “<tt>  of </tt>” and at least one digit",
    regex: "Page \\d+ of \\d+",
  },
  {
    description: "All strings made up of “<tt>abc.</tt>” followed by at least one digit",
    regex: "abc\\.\\d+",
  },
  {
    description: "All strings made up of 6 digits",
    regex: "\\d{6}",
  },
  {
    description: "All strings made up of 6 digits followed by “<tt>.</tt> ” followed by 3 digits",
    regex: "\\d{6}\\.\\d{3}",
  },
  {
    description: "All strings made up of 3 digits followed by “<tt>-</tt> ” followed by 3 digits followed by “<tt>-</tt>” followed by 4 digits",
    regex: "\\d{3}-\\d{3}-\\d{4}",
  },
  {
    description: "All strings made up of at least one digit optionally followed by “<tt>.</tt>” followed by any number of digits",
    regex: "\\d+(\\.)?\\d*",
  },
  {
    description: "All strings made up of 1 to 3 lowercase letters followed by “<tt>-</tt>” followed by 1 to 2 lowercase letters followed by “<tt>-</tt>” followed by 1 to 4 digits",
    regex: "[a-z]{1,3}-[a-z]{1,2}-\\d{1,4}",
  },
  {
    description: "All strings made up of at least one digit followed by “<tt>.</tt>” followed by 1 to 4 digits",
    regex: "\\d+\\.\\d{1,4}",
  },
  {
    description: "All strings made up of an optional “<tt>*</tt>” followed by at least two lowercase letters followed by an optional “<tt>*</tt>”",
    regex: "(\\*)?[a-z]{2,}(\\*)?",
  },
  {
    description: "All strings made up of one or more digits, with an optional “<tt>+</tt>” in front",
    regex: "(\\+)?\\d+",
  },
  {
    description: "All strings made up of two digits followed by “<tt>.5</tt>”",
    regex: "\\d{2}\\.5",
  },
  {
    description: "All strings made up of “<tt>C0</tt>” followed by four digits",
    regex: "C0\\d{4}",
  },
  {
    description: "All strings made up of either one lowercase OR one uppercase letter followed by five digits",
    regex: "[a-zA-Z]\\d{5}",
  },
  {
    description: "All strings made up of an uppercase letter followed by one or more lowercase letters, then a space, then another uppercase letter followed by one or more lowercase letters",
    regex: "[A-Z][a-z]+ [A-Z][a-z]+",
  },
  {
    description: "All nonempty strings made up of “9” followed by 9 digits",
    regex: "9\\d{9}"
  },
  {
    description: "All nonempty strings made up of digits, lowercase and uppercase letters",
    regex: "[a-zA-Z0-9]+"
  },
  {
    description: "All nonempty strings made up of digits",
    regex: "\\d+"
  },
  {
    description: "All strings made up of 3 digits followed by a space followed by 2 digits",
    regex: "\\d{3} \\d{2}"
  },
];
const NUM_TASKS = problems.length;


/*********** Intro slides ***********/


const consentHTML = ["<u><p id='legal'>Consent to Participate</p></u>\
    <p id='legal'>By completing this HIT, you are participating in a \
  study being performed by cognitive scientists in the UC San Diego \
  Department of Psychology. The purpose of this research is to find out\
  how people communicate about patterns. \
  You must be at least 18 years old to participate. There are neither\
  specific benefits nor anticipated risks associated with participation\
  in this study. Your participation in this study is completely voluntary\
  and you can withdraw at any time by simply exiting the study. You may \
  decline to answer any or all of the following questions. Choosing not \
  to participate or withdrawing will result in no penalty. Your anonymity \
  is assured; the researchers who have requested your participation will \
  not receive any personal information about you, and any information you \
  provide will not be shared in association with any personally identifying \
  information.</p> \
  <p> If you have questions about this research, please contact the \
  researchers by sending an email to \
  <b><a href='mailto://cogtoolslab.requester@gmail.com'>cogtoolslab.requester@gmail.com</a></b>. \
  These researchers will do their best to communicate with you in a timely, \
  professional, and courteous manner. If you have questions regarding your \
  rights as a research subject, or if problems arise which you do not feel \
  you can discuss with the researchers, please contact the UC San Diego \
  Institutional Review Board.</p><p>Click 'Next' to continue \
  participating in this HIT.</p>"];

const storyHTML = [`
    <p>In this study you will be a space explorer traveling from planet to
    planet in a new solar system called Gacradus. This solar system has a very
    elaborate etiquette system. On every planet, there are strict rules for
    which words you are allowed to use to talk to the inhabitants. You are
    corresponding with your friend Charlie on Earth, who is charged with
    documenting the intricate language system of this new solar system. Your
    goal is to communicate all of the details about the language of each planet
    to Charlie, but Gacradians are screening your letters and only allowing you
    to send words that are in their language. </p>
    <p>Become a world-famous explorer by explaining all of the details of each
    planet’s language through examples of allowed words! </p>
    <img src="images/conversation.png" width="450" height="300"<br>
    `];

const describeHTML = [ `<p>
    In this study you will regular expressions from examples and provide examples that will allow others guess regular expressions.
    </p>
    <p>
    We will be using a simpler grammar. Specifically we will only allow regexes without arbitrary OR or repetitions (Kleene Star).
    <ol>
      <li>OR is limited to the character classes [a-z], <code>[0-9]</code> (or <code>\\d</code>), [A-Z], [a-zA-Z], [a-zA-Z0-9]</li>
      <li>Optionals are limited to constants strings or one character class from above.</li>
      <li>Repetitions are limited to the character classes above.</li>
    </ol>
    </p>
    <p>
    The following regexes are in the simpler grammar:
    <ol>
      <li><code>[a-z]+</code></li>
      <li><code>[A-Z]*[0-9]*</code></li>
      <li><code>hello( friends)?</code></li>
      <li><code>\d{3}-\d{3}-\d{4}</code></li>
    </ol>
    <p> The following are NOT in the simpler grammar: </p>
    <ol>
      <li><code>\\d+(\\.\\d+)?</code> — it has the complex optional <code>(\\.\\d+)?</code></li>
      <li><code>[A-Z]{3}(\\d{2})?</code> — it has the complex optional <code>(\\d{2})?</code></li>
      <li><code>(cat|dog)</code> — it has an OR of two strings</li>
      <li><code>(cat)+</code> — it has a repetition of a string</li>
    </ol>
    </p>
    `];
  

const listenerInstructionsHTML = ['<p> First you will try to guess regular expressions based on examples someone else gave. </p>  <p> Type in the regular expression into the designated box and press the "Guess" button! </p>']

const speakerInstructionsHTML = ['<p> Press a button to either add or remove examples. \
If your example fits the description it will have "Valid" appear next to it in green, \
and if it doesn\'t it will be labelled "Invalid".</p> \
<p> All of your examples need to be valid. </p>  \
<p> You may provide as many or as few examples as you deem necessary to convey the description.</p> \
<p>Click next to begin the experiment!.</p>']

/** 
const train2 = {
  type: surveyMulipleChoice,
  questions: [
    {
      prompt: "Choose the regular expression that the examples below are describing: <br> <ol> <li>111.</li> <li>111.1</li> </ol>",
      options: ["111(.1)?", "111.(1)?", "[0-9]{3}.[0-9]*", "[0-9]+.[0-9]+", "[0-9]*.[0-9]*", "[0-9].(1)?", "(111.)?(1)?"],
    },]
}
*/

const ex1 = {
  type: SurveyTextPlugin,
  questions : [
  {prompt: "Try to guess the regular expression that describes the examples below: <br> <ol> <li><code>1234hello1234</code></li> <li><code>78hello21</code></li> </ol> <br> "}
  ],
  regex: '\\d+hello\\d+'
}

const ex2 = {
  type: SurveyTextPlugin,
  questions : [
  {prompt: "Try to guess the regular expression that describes the examples below: <br> <ol> <li><code>APM 2402</code></li> <li><code>APM 7218</code></li> <li><code>APM 0121</code></li> <li><code>YORK 3000</code></li></ol> <br> "}
  ],
  regex: '[A-Z]+\\d{4}'
}

const ex3 = {
  type: SurveyTextPlugin,
  questions : [
  {prompt: "Try to guess the regular expression that describes the examples below: <br> <ol> <li><code>cat</code></li> <li><code>dog</code></li> <li><code>tom</code></li> <li><code>the</code></li> <li><code>bug</code></li> </ol> <br> "}
  ],
  regex:'[a-z]+'
}

const ex4 = {
  type: SurveyTextPlugin,
  questions : [
  {prompt: "Try to guess the regular expression that describes the examples below: <br> <ol> <li><code>abc</code></li> <li></code>abc4</code></li></ol> <br> "}
  ],
  regex: '[a-z]{3}(\\d)?'
}

const welcome = {
  type: instructions,
  pages: [ 
    consentHTML,
    describeHTML,
    listenerInstructionsHTML,
  ],
    show_clickable_nav: true
};

const more_instructions = {
  type: instructions,
  pages: [ 
    speakerInstructionsHTML
  ],
    show_clickable_nav: true
};


/** 
const train3 = {
  type: FreeSortPlugin,
  stimuli: regexes,
  stim_width: 90,
  stim_height: 70,
  sort_area_width: 700,
  sort_area_height: 300,
  prompt: "Try to guess the regular expression the examples below are describing: <br> <ol> <li>111</li> <li>111.1</li> </ol> <br> Drag the corresponding regex blocks into the red area and put them into the correct order. <br> <br> "
}
*/
const prior_knowledge = {
  type: surveyMulipleChoice,
  preamble: 'Thank you! The Gacradians have two more questions for you before you leave their solar system.',
  questions: [
    {
      prompt: "I write computer programs:",
      name: "programming_experience",
      options: ["Occasionally", "Professionally"],
      required: false,
    },
    {
      prompt: "I read or write regular expressions:",
      name: "regex_experience",
      options: ["Never", "Occasionally", "Regularly"],
      required: false,
    },
  ],
};

const thank = {
  type: htmlKeyboardResponse,
  stimulus: `<p> Thank you for partcipating in our study! </p>
  <p> To get credit please give Prolific this code: <strong>ABCDEFGH</strong></p>`
};

/************* Putting it all together *************/

const main_experiment = {
  timeline: [{
    type: RegexExamplesPlugin,
    description: jsPsych.timelineVariable('description'),
    regex: jsPsych.timelineVariable('regex'),
    NUM_TASKS: NUM_TASKS,
  }],
  timeline_variables: problems,
  randomize_order: true,
  
};

const timeline = [
  welcome,
  ex1,
  ex2,
  ex3,
  ex4,
  more_instructions,
  main_experiment,
  prior_knowledge,
  thank,
];


jsPsych.run(timeline);

