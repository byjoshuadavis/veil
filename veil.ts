// Veil
//
// Copyright 2011 Iris Couch
// Copyright 2023 Joshua Davis
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

interface Options<> {
  keys: null | "underscore";
  dates: boolean;
  numbers: boolean;
  breaks: RegExp;
  newline: string;
  join: boolean;
  body_key: string;
  header_re: RegExp;
  continued_header_re: RegExp;
}

interface Message {
  [key: string]: string | string[] | Date | number;
}

const defaultOptions = {
  keys: null,
  dates: false,
  numbers: false,
  breaks: /\r?\n/,
  newline: "\n",
  join: true,
  body_key: "body",
  header_re: /^(.*?): +(.*)$/,
  continued_header_re: /^(\s.+)$/,
} as Options;

function parse(message: string, options: Options) {
  var result = message.split(options.breaks).reduce((message, msgLine) => {
    return line(message, msgLine, options);
  }, {} as Message);
  const body = result[options.body_key]
  if (options.join && Array.isArray(body)) {
    result[options.body_key] = body.join(options.newline);
  }

  return result;
}

function line(message: Message, line: string, options: Options) {
  if (options.body_key in message) body(message, line, options);
  else if (line.length === 0) message[options.body_key] = [];
  else header(message, line, options);

  return message;
}

function body(message: Message, line: string, options: Options) {
  if (Array.isArray(message[options.body_key])) {
    (message[options.body_key] as string[]).push(line);
  }
}

function header(message: Message, line: string, options: Options) {
  var last_key = null as string | null;
  var match = line.match(options.header_re),
    key = match && match[1],
    val = match && match[2],
    append = false;

  if (typeof key !== "string" || typeof val !== "string") {
    if (last_key && (match = line.match(options.continued_header_re))) {
      key = last_key;
      val = match[1];
      append = true;
    } else throw new Error("Bad header line: " + JSON.stringify(line));
  }

  if (options.keys === "underscore")
    key = key.toLowerCase().replace(/[^\w+]/g, "_");

  var new_val: string | Date | number = val;
  if (
    options.dates &&
    typeof val == "string" &&
    !val.match(/^\s*-?\d+\.?\d*\s*$/)
  ) {
    new_val = new Date(val);
    if (isNaN(new_val.getTime())) {
      new_val = val;
    }
  }

  if (options.numbers && typeof val === "string") {
    new_val = +val;
    if (isNaN(new_val)) {
      new_val = val;
    }
  }

  if (append && new_val && typeof message[key] === "string") {
    (message[key] as string) += new_val;
  } else if (key && new_val) {
    message[key] = new_val;
    last_key = key;
  }
}

export default function veil(
  message: string,
  opts: Partial<Options> = defaultOptions,
): Message {
  const options = {
    ...defaultOptions,
    ...opts,
  };
  return parse(message, options);
}
