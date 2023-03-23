import json
from django.test import TestCase

from Backend.converter.pymc_converter import convert_model


class SupportTestCase(TestCase):

    def test_convert_model_to_pymc(self):
        js = {
            "id": "f38b262e-025c-46b9-abfb-31f2803394c5",
            "title": "Modelname",
            "body": {
                "nodes": [
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_0",
                        "type": "constant",
                        "position": {
                            "x": 176.36116683172008,
                            "y": 171.55337909143998
                        },
                        "data": {
                            "value": -7
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 176.36116683172008,
                            "y": 171.55337909143998
                        },
                        "dragging": False

                    },
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_1",
                        "type": "constant",
                        "position": {
                            "x": 182.46792501460007,
                            "y": 271.86385955156
                        },
                        "data": {
                            "value": 5
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 182.46792501460007,
                            "y": 271.86385955156
                        },
                        "dragging": False

                    },
                    {
                        "width": 314,
                        "height": 47,
                        "id": "nodes_2",
                        "type": "distribution",
                        "position": {
                            "x": 377,
                            "y": 219.25
                        },
                        "data": {
                            "dist": {
                                "distType": "discrete",
                                "name": "Discrete uniform distribution",
                                "url": "https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.DiscreteUniform.html",
                                "image_url": "https://www.pymc.io/projects/docs/en/stable/_images/pymc-DiscreteUniform-1.png",
                                "input": [
                                    {
                                        "id": "lower-int",
                                        "name": "lower",
                                        "type": "int",
                                        "upper": "inf",
                                        "lower": "-inf",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": False
                                        ,
                                        "optional": False

                                    },
                                    {
                                        "id": "upper-int",
                                        "name": "upper",
                                        "type": "int",
                                        "upper": "inf",
                                        "lower": "-inf",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": False
                                        ,
                                        "optional": False

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "positionAbsolute": {
                            "x": 377,
                            "y": 219.25
                        }
                    },
                    {
                        "width": 327,
                        "height": 47,
                        "id": "nodes_3",
                        "type": "distribution",
                        "position": {
                            "x": 788.906041395453,
                            "y": 195.26889039691966
                        },
                        "data": {
                            "dist": {
                                "distType": "continuous",
                                "name": "Univariate normal log-likelihood",
                                "url": "https://docs.pymc.io/en/v5.0.1/api/distributions/generated/pymc.Normal.html",
                                "image_url": "https://docs.pymc.io/en/v5.0.1/_images/pymc-Normal-1.png",
                                "input": [
                                    {
                                        "id": "sigma",
                                        "name": "sigma - Standard deviation (sigma > 0) (only required if tau is not specified)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": True

                                    },
                                    {
                                        "id": "tau",
                                        "name": "tau - Precision (tau > 0) (only required if sigma is not specified)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": True

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 788.906041395453,
                            "y": 195.26889039691966
                        },
                        "dragging": False

                    },
                    {
                        "width": 251,
                        "height": 90,
                        "id": "nodes_4",
                        "type": "distribution",
                        "position": {
                            "x": 801.9099832423909,
                            "y": 312.32539366534655
                        },
                        "data": {
                            "dist": {
                                "distType": "continuous",
                                "name": "Gamma log-likelihood.",
                                "url": "https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.Gamma.html",
                                "image_url": "https://www.pymc.io/projects/docs/en/stable/_images/pymc-Gamma-1.png",
                                "input": [
                                    {
                                        "id": "alpha",
                                        "name": "alpha",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "-inf",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": False
                                        ,
                                        "optional": False

                                    },
                                    {
                                        "id": "beta",
                                        "name": "beta",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": False

                                    },
                                    {
                                        "id": "mu",
                                        "name": "mu - Expected number of occurrences during the given interval (mu >= 0)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": False

                                    },
                                    {
                                        "id": "sigma",
                                        "name": "sigma - Standard deviation (sigma > 0) (only required if tau is not specified)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": True

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 801.9099832423909,
                            "y": 312.32539366534655
                        },
                        "dragging": False

                    },
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_5",
                        "type": "constant",
                        "position": {
                            "x": 554.4198404564723,
                            "y": 128.1466827548955
                        },
                        "data": {
                            "value": 5
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 554.4198404564723,
                            "y": 128.1466827548955
                        },
                        "dragging": False

                    },
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_6",
                        "type": "constant",
                        "position": {
                            "x": 552.5013122178218,
                            "y": 306.569808949395
                        },
                        "data": {
                            "value": 420
                        },
                        "positionAbsolute": {
                            "x": 552.5013122178218,
                            "y": 306.569808949395
                        },
                        "selected": False
                        ,
                        "dragging": False

                    },
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_7",
                        "type": "constant",
                        "position": {
                            "x": 552.5013122178218,
                            "y": 368.9219767055372
                        },
                        "data": {
                            "value": 69
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 552.5013122178218,
                            "y": 368.9219767055372
                        },
                        "dragging": False

                    },
                    {
                        "width": 126,
                        "height": 46,
                        "id": "nodes_8",
                        "type": "constant",
                        "position": {
                            "x": 552.5013122178217,
                            "y": 432.23340858100477
                        },
                        "data": {
                            "value": 13.34
                        },
                        "positionAbsolute": {
                            "x": 552.5013122178217,
                            "y": 432.23340858100477
                        },
                        "selected": False
                        ,
                        "dragging": False

                    },
                    {
                        "width": 238,
                        "height": 34,
                        "id": "nodes_9",
                        "type": "operation",
                        "position": {
                            "x": 1199.6378334728302,
                            "y": 251.9650536329616
                        },
                        "data": {
                            "dist": {
                                "distType": "operation",
                                "name": "+",
                                "url": "https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.Poisson.html",
                                "image_url": "https://www.pymc.io/projects/docs/en/stable/_images/pymc-Poisson-1.png",
                                "input": [
                                    {
                                        "id": "left",
                                        "name": "left",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "inf",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": False

                                    },
                                    {
                                        "id": "right",
                                        "name": "right",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "inf",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": False

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 1199.6378334728302,
                            "y": 251.9650536329616
                        },
                        "dragging": False

                    },
                    {
                        "width": 327,
                        "height": 47,
                        "id": "nodes_11",
                        "type": "distribution",
                        "position": {
                            "x": 1200.9445987267236,
                            "y": 366.9603959755614
                        },
                        "data": {
                            "dist": {
                                "distType": "continuous",
                                "name": "Univariate normal log-likelihood",
                                "url": "https://docs.pymc.io/en/v5.0.1/api/distributions/generated/pymc.Normal.html",
                                "image_url": "https://docs.pymc.io/en/v5.0.1/_images/pymc-Normal-1.png",
                                "input": [
                                    {
                                        "id": "sigma",
                                        "name": "sigma - Standard deviation (sigma > 0) (only required if tau is not specified)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": True

                                    },
                                    {
                                        "id": "tau",
                                        "name": "tau - Precision (tau > 0) (only required if sigma is not specified)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": True

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 1200.9445987267236,
                            "y": 366.9603959755614
                        },
                        "dragging": False

                    },
                    {
                        "width": 272,
                        "height": 34,
                        "id": "nodes_12",
                        "type": "distribution",
                        "position": {
                            "x": 761.4131893973318,
                            "y": 549.664057309464
                        },
                        "data": {
                            "dist": {
                                "distType": "continuous",
                                "name": "Exponential log-likelihood",
                                "url": "https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.Exponential.html",
                                "image_url": "https://www.pymc.io/projects/docs/en/stable/_images/pymc-Exponential-1.png",
                                "input": [
                                    {
                                        "id": "lam",
                                        "name": "lam - Rate or inverse scale (lam > 0)",
                                        "type": "float",
                                        "upper": "inf",
                                        "lower": "0",
                                        "upperInclusive": False
                                        ,
                                        "lowerInclusive": True
                                        ,
                                        "optional": False

                                    }
                                ],
                                "output": {
                                    "id": "support",
                                    "type": "float",
                                    "upper": "inf",
                                    "lower": "-inf",
                                    "upperInclusive": False
                                    ,
                                    "lowerInclusive": False

                                }
                            }
                        },
                        "selected": False
                        ,
                        "positionAbsolute": {
                            "x": 761.4131893973318,
                            "y": 549.664057309464
                        },
                        "dragging": False

                    }
                ],
                "edges": [
                    {
                        "source": "nodes_0",
                        "sourceHandle": "constant",
                        "target": "nodes_2",
                        "targetHandle": "lower-int",
                        "id": "reactflow__edge-nodes_0constant-nodes_2lower-int"
                    },
                    {
                        "source": "nodes_1",
                        "sourceHandle": "constant",
                        "target": "nodes_2",
                        "targetHandle": "upper-int",
                        "id": "reactflow__edge-nodes_1constant-nodes_2upper-int"
                    },
                    {
                        "source": "nodes_2",
                        "sourceHandle": "support",
                        "target": "nodes_3",
                        "targetHandle": "sigma",
                        "id": "reactflow__edge-nodes_2support-nodes_3sigma"
                    },
                    {
                        "source": "nodes_2",
                        "sourceHandle": "support",
                        "target": "nodes_4",
                        "targetHandle": "alpha",
                        "id": "reactflow__edge-nodes_2support-nodes_4alpha"
                    },
                    {
                        "source": "nodes_5",
                        "sourceHandle": "constant",
                        "target": "nodes_3",
                        "targetHandle": "tau",
                        "id": "reactflow__edge-nodes_5constant-nodes_3tau"
                    },
                    {
                        "source": "nodes_6",
                        "sourceHandle": "constant",
                        "target": "nodes_4",
                        "targetHandle": "beta",
                        "id": "reactflow__edge-nodes_6constant-nodes_4beta"
                    },
                    {
                        "source": "nodes_7",
                        "sourceHandle": "constant",
                        "target": "nodes_4",
                        "targetHandle": "mu",
                        "id": "reactflow__edge-nodes_7constant-nodes_4mu"
                    },
                    {
                        "source": "nodes_8",
                        "sourceHandle": "constant",
                        "target": "nodes_4",
                        "targetHandle": "sigma",
                        "id": "reactflow__edge-nodes_8constant-nodes_4sigma"
                    },
                    {
                        "source": "nodes_3",
                        "sourceHandle": "support",
                        "target": "nodes_9",
                        "targetHandle": "left",
                        "id": "reactflow__edge-nodes_3support-nodes_9mu"
                    },
                    {
                        "source": "nodes_9",
                        "sourceHandle": "support",
                        "target": "nodes_11",
                        "targetHandle": "sigma",
                        "id": "reactflow__edge-nodes_9support-nodes_11sigma"
                    },
                    {
                        "source": "nodes_4",
                        "sourceHandle": "support",
                        "target": "nodes_11",
                        "targetHandle": "tau",
                        "id": "reactflow__edge-nodes_4support-nodes_11tau"
                    },
                    {
                        "source": "nodes_12",
                        "sourceHandle": "support",
                        "target": "nodes_9",
                        "targetHandle": "right",
                        "id": "reactflow__edge-nodes_4support-nodes_11tau"
                    }
                ],
                "viewport": {
                    "x": 300.4979346212506,
                    "y": 22.61112999341782,
                    "zoom": 0.5719654866018998
                },
                "lastIndex": 13
            }
        }

        print(convert_model(js))
