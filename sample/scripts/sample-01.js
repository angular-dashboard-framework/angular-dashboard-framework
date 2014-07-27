/* *
 * The MIT License
 * 
 * Copyright (c) 2014, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

angular.module('sample-01', ['adf', 'LocalStorageModule'])
	.controller('sample01Ctrl', function($scope, localStorageService) {

		var name = 'sample-01';
		var model = localStorageService.get(name);
		if (!model) {
			// set default model for demo purposes
			model = {
				title: "Sample 01",
				rows: [
					{
						columns: [
							{
								widgets: [
									{
										type: "linklist",
										title: "Links",
										config: {
											links: [
												{
													title: "SCM-Manager",
													href: "http://www.scm-manager.org"
												}, {
													title: "Github",
													href: "https://github.com"
												}, {
													title: "Bitbucket",
													href: "https://bitbucket.org"
												}, {
													title: "Stackoverflow",
													href: "http://stackoverflow.com"
												}
											]
										},
									}, {
										type: "weather",
										title: "Weather Hildesheim",
										config: {
											location: "Hildesheim"
										},

									}, {
										type: "weather",
										title: "Weather",
										config: {
											location: "Edinburgh"
										},
									}
								]
							}, {
								widgets: [
									{
										type: "linklist",
										title: "Links",
										config: {
											links: [
												{
													title: "SCM-Manager",
													href: "http://www.scm-manager.org"
												}, {
													title: "Github",
													href: "https://github.com"
												}, {
													title: "Bitbucket",
													href: "https://bitbucket.org"
												}, {
													title: "Stackoverflow",
													href: "http://stackoverflow.com"
												}
											]
										},
									}, {
										type: "weather",
										title: "Weather Hildesheim",
										config: {
											location: "Hildesheim"
										},

									}, {
										type: "weather",
										config: {
											location: "Edinburgh"
										},
										title: "Weather"
									}
								]
							}, {
								widgets: [
									{
										type: "linklist",
										title: "Links",
										config: {
											links: [
												{
													title: "SCM-Manager",
													href: "http://www.scm-manager.org"
												}, {
													title: "Github",
													href: "https://github.com"
												}, {
													title: "Bitbucket",
													href: "https://bitbucket.org"
												}, {
													title: "Stackoverflow",
													href: "http://stackoverflow.com"
												}
											]
										}

									}, {
										type: "weather",
										title: "Weather Hildesheim",
										config: {
											location: "Hildesheim"
										}

									}, {
										type: "weather",
										title: "Weather",
										config: {
											location: "Edinburgh"
										}

									}
								]
							}
						]
					}
				]
			};
		}
		$scope.name = name;
		$scope.model = model;
		$scope.collapsible = false;

		$scope.$on('adfDashboardChanged', function(event, name, model) {
			localStorageService.set(name, model);
		});
	});