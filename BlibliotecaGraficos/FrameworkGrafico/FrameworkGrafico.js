/// <reference path="./Bliblioteca/chartjs-plugin-zoom.js" />
/// <reference path="./Bliblioteca/chart.js" />
/// <reference path="./Bliblioteca/hammer.js" />
/// <reference path="./Bliblioteca/ColorScheme.js" />
/// <reference path="./Bliblioteca/color-scheme.js" />
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.746.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />


/*
 * Generated 01/06/2021 13:21:34
 * Copyright (C) 2021
 */
var TcHmi;
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    let Controls;
    (function (/** @type {globalThis.TcHmi.Controls} */ Controls) {
        let BlibliotecaGraficos;
        (function (BlibliotecaGraficos) {
            class FrameworkGrafico extends TcHmi.Controls.System.TcHmiControl {
                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters.
                - The "changed detection" in the setter will result in processing the value only once while compile.
                - Attention: If we have a Server Binding on an Attribute the setter will be called once with null to initialize and later with the correct value.
                */
                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);

                    // variaveis de configuração de todos os graficos
                    var sTitulo = null;
                    var sTamanhoTitulo = null;
                    var sSubtitulo = null;
                    var iSubtitleFontSize = null;
                    var sPrefixY = null;
                    var eTheme = null;
                    var eDataType = null;
                    var data = [];
                    var Tensao = null;
                    var Preenchimento = null;
                    var CorLinha = null;
                    var CorPonto = null;
                    var Sufixo = null;
                    var CasaDecimais = null;
                    var xLegenda = null;
                    var xAtualizaGrafico = true;


                    // variaveis de configuração das cores do grafico de pizza
                    var SchemesPaleta = 'triade';
                    var Variacoespaleta = 'soft';
                    var DistanciaPaleta = 1;
                    var TransparenciaPaleta = 1;
                    var tamanhoDados = -1;


                    var xMultiEscalas = true;
                    var MaximoSugerido = null;
                    var MinimoSugerido = null;
                    
                    var typeEixoX = null;

                    

                    var chart = null;
                    var xAtualiza = false;
                    var xMostraGrid = true; 

                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
                    // Fetch template root element
                    // pega os elementos do framework instanciado
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_BlibliotecaGraficos_FrameworkGrafico-Template');
                    this.__elementContainer = this.__elementTemplateRoot.find('.tchmi_container');
                    this.__elementMyChart = this.__elementContainer.find('.tchmi_myChart');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }


                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }

                

                __attach() {
                    super.__attach();



                    var $this = this;
                    // quando vier o atualiza grafico ele atualiza os dados do grafico
                    $(this.__elementTemplateRoot).on("AtualizaGrafico", function (e) {

                    if ($this.xAtualizaGrafico) {
                        //ve o max do grafico, sempre começa no 0
                        if ($this.data[0].length > -1) {
                            var max = $this.data[0].length;
                        } else {
                            var max = $this.data.length;
                        }
                        
                        //variavel auxiliar
                        var i;

                        
                        // se nao mudar de tamanho ou for a primeira vez rodando ele nao cria essa parte das cores, menos processamento toda vez
                        // a nao ser que tenha mudado a configuração, ai ele passa de novo pra ficar atualizado
                        if ($this.tamanhoDados != max || $this.xAtualiza) {

                            $this.tamanhoDados = max;
                            $this.xAtualiza = false;

                            // monta a a variavel pra mostrar certo no grafico
                            var data = [];
                            data['labels'] = [];
                            data['datasets'] = [];
                            data['datasets'][0] = {
                                type: $this.eDataType,
                                data: [],
                                backgroundColor: [],
                                borderColor: $this.CorLinha.color,
                                label: $this.data[0].label,
                                tension: $this.Tensao,
                                fill: $this.Preenchimento
                            };

                            //gera cores para o grafico de pizza
                            //console.log($this.data['sCor']);
                            if ($this.eDataType == 'pie') {
                                //console.log($this.data[0].sCor);
                                if ($this.data[0].sCor == '') {
                                    var scheme = new ColorScheme;
                                    scheme.from_hex(rgba2hex($this.CorPonto.color))         // Start the scheme
                                        .scheme($this.SchemesPaleta)     // Use the 'triade' scheme, that is, colors
                                        .variation($this.Variacoespaleta)   // Use the 'soft' color variation
                                        .distance($this.DistanciaPaleta);
                                    var colors = scheme.colors();

                                    // se for maior faz assim que ai ele vai jogando cores bem diferentes para varaveis perto
                                    if ($this.data.length < colors.length) {
                                        for (i = 0; i < max; i++) {
                                            if (ePar(i)) {
                                                data['datasets'][0].backgroundColor[i] = hexToRgbA('#' + colors[i], $this.TransparenciaPaleta);
                                            } else {
                                                data['datasets'][0].backgroundColor[i] = hexToRgbA('#' + colors[colors.length - i], $this.TransparenciaPaleta);
                                            }
                                            k++;
                                        }
                                    } else {
                                        // se for igual é so jogar oq tem lá
                                        if ($this.data.length == colors.length) {
                                            data['datasets'][0].backgroundColor[i] = hexToRgbA('#' + colors[i], $this.TransparenciaPaleta);
                                        } else {
                                            // se tiver mais variaveis que cor tem que pensar
                                            data = GeraDadosMuitasUnidade(data, rgba2hex($this.CorPonto.color), 0, $this);
                                        }
                                    }
                                } else {
                                    //Se tiver definido cor pro fundo ele pega as cores que mandaram
                                    for (i = 0; i < max; i++) {
                                        if ($this.data[i].sCor != '') {
                                            data['datasets'][0].backgroundColor[i] = $this.data[i].sCor;
                                        }
                                    }
                                }
                            }
                        } else {
                            var data = $this.chart.data;
                        }

                        /// PARA MATRIZES
                        if ($this.data[0].length > -1) {

                            if ($this.data[0].sCor == '') {
                            // gera as cores possiveis
                            var scheme = new ColorScheme;
                            scheme.from_hex(rgba2hex($this.CorPonto.color))         // Start the scheme
                                .scheme($this.SchemesPaleta)     // Use the 'triade' scheme, that is, colors
                                .variation($this.Variacoespaleta)   // Use the 'soft' color variation
                                .distance($this.DistanciaPaleta);
                            var colors = scheme.colors();

                            var repetições = 0;
                            // joga os dados na variavel
                                for (var j = 0; j < $this.data.length; j++) {

                                    var auxY = 'y'
                                    if ($this.xMultiEscalas && j > 0) {
                                        auxY = auxY.concat(j.toString())
                                    }

                                    data['datasets'][j] = {
                                        data: [],
                                        backgroundColor: [],
                                        borderColor: $this.CorLinha.color,
                                        label: $this.data[j][0].label,
                                        tension: $this.Tensao,
                                        fill: $this.Preenchimento,
                                        // adicionado para fazer mais de um grafico ambos ficar em escala
                                        yAxisID: auxY,
                                        xAxisID: 'x'
                                    };
                                    var k = 0;
                                    for (i = 0; i < $this.data[j].length; i++) {
                                        var el = $this.data[j][i];
                                        if (!el.xNaoMostra) {
                                            data['labels'][k] = el.x;
                                            data['datasets'][j].data[k] = el.y;
                                            // se nao for pizza faz isso, pizza é feito ali em cima
                                            if ($this.eDataType != 'pie') {
                                                var aux = j - (colors.length * repetições);
                                                data['datasets'][j].backgroundColor[k] = hexToRgbA('#' + colors[aux], $this.TransparenciaPaleta);
                                            }
                                            k++;
                                        }
                                    }

                                    var aux = (colors.length - 2) + ((colors.length - 2) * repetições);
                                    if (j > aux) {
                                        repetições++
                                        scheme.from_hex(colors[colors.length - 1]);
                                        colors = scheme.colors();
                                    }
                                }

                            } else {
                                //Se a cor for definida, ele trabalha os dados aqui
                                for (var j = 0; j < $this.data.length; j++) {

                                    var auxY = 'y'
                                    if ($this.xMultiEscalas && j > 0) {
                                        auxY = auxY.concat(j.toString())
                                    }

                                    data['datasets'][j] = {
                                        type: $this.data[j][0].sTipo,
                                        data: [],
                                        backgroundColor: [],
                                        borderColor: [],
                                        label: $this.data[j][0].label,
                                        tension: $this.Tensao,
                                        fill: $this.Preenchimento,
                                        // adicionado para fazer mais de um grafico ambos ficar em escala
                                        yAxisID: auxY,
                                        xAxisID: 'x',
                                        radius: 0
                                    };

                                    var k = 0;
                                    for (i = 0; i < $this.data[j].length - 1; i++) {
                                        var el = $this.data[j][i];
                                        //Se tiver abilitado pra mostrar
                                        if (!el.xNaoMostra) {
                                            if ($this.typeEixoX == 'time') {
                                                data['labels'][k] = new Date(el.x);
                                            } else {
                                                data['labels'][k] = (el.x);
                                            }
                                            data['datasets'][j].data[k] = el.y;
                                            data['datasets'][j].backgroundColor[k] = el.sCor;
                                            data['datasets'][j].borderColor[k] = el.sCor;
                                            k++;
                                        }
                                    }
                                }
                            }
                        // SE NAO FOR MATRIZ
                        } else {
                            // joga os dados na variavel

                            var k = 0;
                            for (i = 0; i < max; i++) {
                                if ($this.data[i].sCor != '')
                                {
                                    var el = $this.data[i];
                                    if (!el.xNaoMostra) {
                                        if ($this.typeEixoX == 'time') {
                                            data['labels'][k] = new Date(el.x);
                                        } else {
                                            data['labels'][k] = (el.x);
                                        }
                                        data['datasets'][0].data[k] = Math.trunc(el.y * 10000) / 10000;
                                        data['datasets'][0].backgroundColor[k] = el.sCor;
                                        // se nao for pizza faz isso, pizza é feito ali em cima
                                        if (!($this.eDataType == 'pie')) {
                                         //   data['datasets'][0].backgroundColor[k] = $this.CorPonto.color;
                                        }
                                        k++;
                                    }
                                }
                                
                            }
                        }

                        /*
                        let MaximoSugeridoAnterior = $this.MaximoSugerido;

                        //Ve qual tamanho suggestedMax ele vai dar
                        if ($this.data[0].length < -1) {
                            $this.MaximoSugerido = $this.data[0].x;
                            var max = $this.data[0].length;
                            //Se nao for matrix
                            for (i = 0; i < max; i++) {
                                var el = $this.data[i];
                                if ($this.MaximoSugerido < el.x) {
                                    $this.MaximoSugerido = el.x;
                                }
                            }
                        } else {
                            //Se for matrix
                            $this.MaximoSugerido = $this.data[0][0].x;
                            for (var j = 0; j < $this.data.length; j++) {
                                for (i = 0; i < $this.data[j].length; i++) {
                                    var el = $this.data[j][i];
                                    if ($this.MaximoSugerido < el.x) {
                                        $this.MaximoSugerido = el.x;
                                    }
                                }
                            }
                        }

                        $this.MaximoSugerido = Number($this.MaximoSugerido) + 2;

                        if ($this.MaximoSugerido != MaximoSugeridoAnterior) {
                            $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                            $this.xAtualizaGrafico = true;
                        }
                        */

                    
                        // joga os dados nos dados do grafico
                        $this.chart.data = data;
                        //da um update no grafico
                        $this.chart.update('none');
                    }
                    })







                    // atualiza as config do grafico, é pra ficar mais facil na hora de programar
                    $(this.__elementTemplateRoot).on("AtualizaConfigGrafico", function (e) {

                        if ($this.xAtualizaGrafico) {


                            $this.xAtualiza = true;

                            // se tiver sido instanciado ele destroi antes de criar de novo

                            

                            if ($this.chart) {
                                //Guarda as informaçoes que ele ja tem
                                var data = $this.chart.config._config.data;
                                $this.chart.destroy();
                            }


                            // joga no chart la de fora a nova versao do grafico
                            $this.chart = new Chart($this.__elementMyChart, {
                                //type: $this.eDataType,

                                options: {
                                    clip: true,
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            type: $this.typeEixoX,
                                            //suggestedMax: new Date($this.MaximoSugerido),//'1970-01-21', //MaxSugerido,
                                            //suggestedMin: new Date($this.MinimoSugerido),//'1970-01-21', //MaxSugerido,
                                            ticks: {
                                                //stepSize: 1,
                                            },
                                            alignToPixels: false,
                                            display: $this.xMostraGrid,
                                            drawOnChartArea: $this.xMostraGrid,
                                            grid: {
                                                offset: false,
                                                //borderWidth : 0
                                                //display: false
                                                //drawBorder : false
                                                //borderColor: '#00000000'
                                                drawOnChartArea: true
                                            }
                                        },
                                        y: {
                                            beginAtZero: false,
                                            display: $this.xMostraGrid,
                                            drawOnChartArea: $this.xMostraGrid,
                                            stacked: false,
                                            ticks: {
                                                precision: 0,
                                                // Adiciona o sufixo
                                                callback: function (value, index, values) {
                                                    if ($this.eDataType == 'pie') {
                                                        return value;
                                                    } else {
                                                        return $this.sPrefixY + value + $this.Sufixo;
                                                    }

                                                }
                                            }
                                        }
                                    },
                                    tooltip: {
                                        active: true,
                                        callbacks: {
                                            label: function (context, tooltipItem, data) {

                                                if ($this.eDataType == 'pie') {

                                                    console.log(tooltipItem);
                                                    console.log(data);
                                                    console.log(context);

                                                    var indice = tooltipItem.index;
                                                    return data.labels[indice] + ': ' + data.datasets[0].data[indice] + '';

                                                } else {
                                                    var label = context.dataset.label || '';
                                                    // se tiver aluguma coisa ele faz
                                                    if (typeof context.parsed.y != 'undefined') {
                                                        //gera a variavel do jeito certo pra tool tip
                                                        var aux = (context.parsed.y).toLocaleString('pt-BR', { maximumFractionDigits: $this.CasaDecimais });
                                                        label = $this.sPrefixY + aux + $this.Sufixo;
                                                        return label;
                                                    }
                                                }


                                                return;
                                            }
                                        }
                                    },
                                    plugins: {
                                        tooltip: {
                                            active: true,
                                            callbacks: {
                                                label: function (context) {
                                                    var label = context.dataset.label || '';

                                                    // se nao for matriz
                                                    if (!($this.data[0].length > -1)) {
                                                        if ($this.eDataType == 'pie') {
                                                            //console.log(context);
                                                            //return context.label + ': ' + context.parsed;
                                                            var aux = (context.parsed).toLocaleString('pt-BR', { maximumFractionDigits: $this.CasaDecimais });
                                                            label = context.label + ': ' + $this.sPrefixY + ' ' + aux + ' ' + $this.Sufixo;
                                                            return label;

                                                        } else {

                                                            // se tiver aluguma coisa ele faz
                                                            if (typeof context.parsed.y != 'undefined') {
                                                                //gera a variavel do jeito certo pra tool tip
                                                                var aux = (context.parsed.y).toLocaleString('pt-BR', { maximumFractionDigits: $this.CasaDecimais });
                                                                label = $this.sPrefixY + ' ' + aux + ' ' + $this.Sufixo;
                                                                return label;
                                                            }
                                                        }

                                                    } else {
                                                        //gera a variavel do jeito certo pra tool tip
                                                        var aux = (context.parsed.y).toLocaleString('pt-BR', { maximumFractionDigits: $this.CasaDecimais });
                                                        label = context.dataset.label + ': ' + $this.sPrefixY + ' ' + aux + ' ' + $this.Sufixo;
                                                        return label;
                                                    }
                                                    return;
                                                }
                                            }
                                        },
                                        title: {
                                            display: true,
                                            text: $this.sTitulo,
                                            font: {
                                                size: $this.sTamanhoTitulo
                                            }
                                        },
                                        legend: {
                                            display: $this.xLegenda
                                        },
                                        zoom: {
                                            pan: {
                                                enabled: true,
                                                mode: 'xy',
                                                overScaleMode: 'y'
                                            },
                                            zoom: {
                                                wheel: {
                                                    enabled: true,
                                                },
                                                pinch: {
                                                    enabled: true,
                                                },
                                                mode: 'xy',
                                                overScaleMode: 'y'
                                            }
                                        }
                                    }
                                }

                            });

                            //bota as informaçoes que ele pegou la em cima de volta no grafico
                            $this.chart.data = data;
                            $this.chart.update('none');
                        }
                    });

                    
                    

                    $(this.__elementTemplateRoot).dblclick(function (e) {
                        $this.chart.resetZoom();
                    });



                    // no final do atactched ele gera um evento para renderizar o grafico, é pra ficar melhor na tela quando estiver fazendo ela
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                    $(this.__elementTemplateRoot).trigger('AtualizaGrafico');

                    
                }

                __detach() {
                    super.__detach();
                }

                destroy() {
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();

                }



                setTitle(newValue) {
                    this.sTitulo = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                    //console.log(this.chart);
                }

                getTitle() {
                    return this.sTitulo;
                }

                setFontTitle(newValue) {
                    this.sTamanhoTitulo = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getFontTitle() {
                    return this.sTamanhoTitulo;
                }

                setSubtitle(newValue) {
                    this.sSubtitulo = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getSubtitle() {
                    return this.sSubtitulo;
                }

                setSubtitleFontSize(newValue) {
                    this.iSubtitleFontSize = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getSubtitleFontSize() {
                    return this.iSubtitleFontSize;
                }

                setPrfix(newValue) {
                    this.sPrefixY = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getPrfix() {
                    return this.sPrefixY;
                }

                setTheme(newValue) {
                    this.eTheme = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getTheme() {
                    return this.eTheme;
                }

                setDatatype(newValue) {
                    this.eDataType = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getDatatype() {
                    return this.eDataType;
                }

                settypeEixoX(newValue) {
                    this.typeEixoX = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                gettypeEixoX() {
                    return this.eDataType;
                }

                setData(newValue) {
                    this.data = newValue;
                    //console.log(this.data);
                   // $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    $(this.__elementTemplateRoot).trigger('AtualizaGrafico');
                    //console.log("Atualizei vetor");
                }

                getData() {
                    return this.data;
                }

                setTensao(newValue) {
                    this.Tensao = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getTensao() {
                    return this.Tensao;
                }

                setPreenchimento(newValue) {
                    this.Preenchimento = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getPreenchimento() {
                    return this.Preenchimento;
                }

                setCorLinha(newValue) {
                    this.CorLinha = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getCorLinha() {
                    return this.CorLinha;
                }

                setCorPonto(newValue) {
                    this.CorPonto = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getCorPonto() {
                    return this.CorPonto;
                }

                setSufixo(newValue) {
                    this.Sufixo = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getSufixo() {
                    return this.Sufixo;
                }
                
                setCasaDecimais(newValue) {
                    this.CasaDecimais = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getCasaDecimais() {
                    return this.CasaDecimais;
                }
                
                setxLegenda(newValue) {
                    this.xLegenda = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getxLegenda() {
                    return this.xLegenda;
                }

                setSchemesPaleta(newValue) {
                    this.SchemesPaleta = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getSchemesPaleta() {
                    return this.SchemesPaleta;
                }

                setVariacoespaleta(newValue) {
                    this.Variacoespaleta = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico');
                }

                getVariacoespaleta() {
                    return this.Variacoespaleta;
                }

                setDistanciaPaleta(newValue) {
                    this.DistanciaPaleta = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                }

                getDistanciaPaleta() {
                    return this.DistanciaPaleta;
                }

                setTransparenciaPaleta(newValue) {
                    this.TransparenciaPaleta = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                }

                getTransparenciaPaleta() {
                    return this.DistanciaPaleta;
                }

                setxAtualizaGrafico(newValue) {
                    this.xAtualizaGrafico = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    //console.log(this.data);
                }

                getxAtualizaGrafico() {
                    return this.xAtualizaGrafico;
                }


                setMultiEscalas(newValue) {
                    this.xMultiEscalas = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    //console.log(this.data);
                }

                getMultiEscalas() {
                    return this.xMultiEscalas;
                }


                setxMostraGrid(newValue) {
                    this.xMostraGrid = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    //console.log(this.data);
                }

                getxMostraGrid() {
                    return this.xMostraGrid;
                }


                setMaximoSugerido(newValue) {
                    this.MaximoSugerido = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    //console.log(this.data);
                }

                getMaximoSugerido() {
                    return this.MaximoSugerido;
                }


                setMinimoSugerido(newValue) {
                    this.MinimoSugerido = newValue;
                    $(this.__elementTemplateRoot).trigger('AtualizaConfigGrafico')
                    //console.log(this.data);
                }

                getMinimoSugerido() {
                    return this.MaximoSugerido;
                }

                
                
            }
            BlibliotecaGraficos.FrameworkGrafico = FrameworkGrafico;
        })(BlibliotecaGraficos = Controls.BlibliotecaGraficos || (Controls.BlibliotecaGraficos = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
/**
* Register Control
*/
TcHmi.Controls.registerEx('FrameworkGrafico', 'TcHmi.Controls.BlibliotecaGraficos', TcHmi.Controls.BlibliotecaGraficos.FrameworkGrafico);





















function random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgba(" + x + "," + y + "," + z + "," + Math.random() +")";
    return bgColor;
}

function hexToRgbA(hex,Alfa) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + Alfa +')';
    }
    throw new Error('Bad Hex');
}

function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    return hex;
}

function ePar(n) {
    return n % 2 == 0;
}

function eImpar(n) {
    return Math.abs(n % 2) == 1;
}



function GeraDadosMuitasUnidade(Dados, CorInicial, i , $this) {

    var scheme = new ColorScheme;
    scheme.from_hex(CorInicial)         // Start the scheme
        .scheme($this.SchemesPaleta)     // Use the 'triade' scheme, that is, colors
        .variation($this.Variacoespaleta)   // Use the 'soft' color variation
        .distance($this.DistanciaPaleta);
    var colors = scheme.colors();

    var MaxDados = $this.data.length;
    var MaxCor = colors.length;

    if ((i + MaxCor) < MaxDados) {

        for (var j = 0; j < MaxCor; j++) {
            if (ePar(j)) {
                Dados['datasets'][0].backgroundColor[i + j] = hexToRgbA('#' + colors[j], $this.TransparenciaPaleta);
            } else {
                Dados['datasets'][0].backgroundColor[i + j] = hexToRgbA('#' + colors[colors.length - j], $this.TransparenciaPaleta);
            }
        }

        i = i + MaxCor;
        dadosComCor = GeraDadosMuitasUnidade(Dados, colors[colors.length-1], i, $this);

    } else {
        for (var j = 0; (j + i) < MaxDados; j++) {
            if (ePar(j)) {
                Dados['datasets'][0].backgroundColor[i + j] = hexToRgbA('#' + colors[j], $this.TransparenciaPaleta);
            } else {
                Dados['datasets'][0].backgroundColor[i + j] = hexToRgbA('#' + colors[colors.length - j], $this.TransparenciaPaleta);
            }
        }
        dadosComCor = Dados;
    }

    return dadosComCor;
}



