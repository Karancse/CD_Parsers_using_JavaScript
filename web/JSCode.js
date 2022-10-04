function generatepr (pr2) {
    var pr3 = pr2.split(' ').join('')
    var pr={}

    var pr3Array = pr3.split('\n')
    var i , j , q 
    for ( i=0; i<pr3Array.length; i++ ) {
        j = pr3Array[i].split('->')
        q = j[1].split(',')
        pr[j[0]]=q
    }

    return pr
}

function generateTerminals (pr) {
    var T=[]
    console.log(Object.values(pr))
    Object.values(pr).map(i => {
        i.map(j => {
            console.log(j)
            for(var z=0;z<j.length;z++) {
                if(j.charCodeAt(z) >= 97 && j.charCodeAt(z) <= 122 && !T.includes(j[z])) 
                    T.push(j[z])
            }
        })
    })
    return T
}

function generatepr1 (pr) {
    var pr1=[]

    Object.keys(pr).map(j => {
        pr[j].map(z => {
            pr1.push([j,z])
        })
    })

    return pr1
}

function first (a , T , pr) {
    var c = [] , b , z
    var st = [ a ]
    var st1 = []
    while(true) {
        b = []
        while(st.length) {
            z = st.pop()
            if(z.length === 1) 
                if(z === "#" || T.includes(z)) 
                    if(!b.includes(z)) {
                        b.push( z )
                        continue
                    }
            if(T.includes(z[0])) {
                if(!b.includes(z))
                    b.push( z )
                continue
            }
            for(i=0;i<pr[z[0]].length;i++) {
                st.push(pr[z[0]][i])
            }
            if(z.length > 1)
                st1.push(z.slice(1))
            continue;
        }
        for(i=0;i<b.length;i++) {
            if(b[i] !== '#' && !c.includes(b[i])) {
                c.push(b[i])
            }
        }
        if(b.includes('#')) {
            if(st1.length) {
                st.push(st1.pop())
                continue
            }
            c.push('#')
        }
        break
    }
    return c
}

function follow(qq , NT , T , pr) {
    var st = [ qq ]
    var b = [] , a , i , j , zz 
    while(st.length) {
        a = st.pop()
        for(i=0;i<NT.length;i++) {
            for(j=0;j<pr[NT[i]].length;j++) {
                for(zz=0;zz<pr[NT[i]][j].length;zz++) {
                    if (pr[NT[i]][j][zz] === a && zz<pr[NT[i]][j].length-1) {
                        c = first( pr[NT[i]][j].slice(zz+1) , T , pr)
                        for(cc=0;cc<c.length;cc++) {
                            if(!b.includes(c[cc]))
                                b.push(c[cc])
                        }
                    }
                    else if (pr[NT[i]][j][zz] === a && zz === pr[NT[i]][j].length-1) {
                        if(NT[i]=='S!') {
                            b.push('$')
                            continue
                        }
                        if (!st.includes(NT[i])) {
                            st.push(NT[i])
                        }   
                    }
                }
            }
        }
    }
    if (b.includes('#'))
        b[b.indexOf('#')]='$'
    return b
}

function parselrtable (inp , tdf , pr1 , NT , T ) {
    var st=[0] , qq=0 , i=0 , sti=[0] , stz=[0] , i , j , q , parsedChar

    while(true) {
        if(i<inp.length)
            parsedChar = inp[i]
        else
            parsedChar = '$'
        console.log("\n")
        console.log("inp[i] :",inp[i])
        console.log("st :",st)
        console.log("sti :",sti)
        console.log("stz :",stz)
        if(parsedChar !== '$')
            if(!NT.includes(parsedChar) && !T.includes(parsedChar)) {
                console.log("  The Input String is Not Accepted by the Grammer")
                break
            }   
        q = tdf[parsedChar][st[st.length-1]]
        console.log("q :",q[0],",",q[1])
        if(q[0] === -2) {
            console.log("  The Input String is Accepted by the Grammer")
            sti.push('$')
            sti.push('accept')
            stz.push(0)
            stz.push(0)
            qq=1    
            break
        }
        if(q[0] !== -1) {
            console.log("  q[0] :",q[0])
            st.push(parsedChar)
            st.push(q[0])
            sti.push(parsedChar)
            sti.push(q[0])
            stz.push(0)
            stz.push(0)
            i+=1
            continue
        }
        if( q[1].length === 1 ) {
            console.log("  q[1] :",q[1])
            for(j=0;j<pr1[q[1][0]][1].length;j++) {
                st.pop()
                st.pop()
                zzz=stz.length-1
                while(stz[zzz]===1)
                    zzz-=1
                stz[zzz]=1
                stz[zzz-1]=1
            }
            st.push(pr1[q[1][0]][0])
            st.push(tdf[st[st.length-1]][st[st.length-2]][0])
            //sti.push(pr1[q[1][0]][0])
            //sti.push(tdf[st[st.length-2]][st[st.length-3]][0])
            sti.push(st[st.length-2])
            sti.push(st[st.length-1])
            stz.push(0)
            stz.push(0)
            continue
        }
        console.log("The Input String is Not Accepted by the Grammer")
        break
    }
    console.log("sti :",sti)
    console.log("stz :",stz)

    s+="<div id=\"transitions\"><div class=\"item\">"
    j=0
    sti.map(i=> {
        if(stz[j]===0) {
            s+="<div class=\"LHS\"><div class=\"LHS2\">"
            s+= i.toString()
            s+="</div></div>"
        }
        else {
            s+="<div class=\"RHS\"><div class=\"RHS2\">"
            s+=i.toString()
            s+="</div></div>"
        }
        j+=1
    })
    s+="</div>"

    //return ({st,sti,stz})
}

function generatell0(pr2 , inp) {   
    //var pr2 = "S!->S\nS->ABC\nA->a,#\nB->b,#\nC->c,#"
    //var inp = "ab"
    console.log("pr2 :",pr2)
    var pr3 = pr2.split(' ').join('').split("\r").join("")
    pr={}

    var pr3Array = pr3.split('\n')
    var i , j , z , a , b , zz , cc , row , q 
    for ( i=0; i<pr3Array.length; i++ ) {
        j = pr3Array[i].split('->')
        q = j[1].split(',')
        pr[j[0]]=q
    }
    //pr={'S!':['S'],'S':['ABC'],'A':['a','#'],'B':['b','#'],'C':['c','#']}

    var NT=Object.keys(pr)
    console.log(NT)
    var T=[]

    NT.map((i) => {
        pr[i].map((j) => {
            for(z=0;z<j.length;z++) {
                if(j.charCodeAt(z) >= 97 && j.charCodeAt(z) <= 122 && !T.includes(j[z])) 
                    T.push(j[z])
            }
        })
    })

    console.log("Production Rules :",pr)
    console.log("Non-Terminals :",NT)
    console.log("Terminals :",T)
    //return
    var q1={}
    var q2={}

    function first (a) {
        c = []
        var st = [ a ]
        var st1 = []
        while(true) {
            b = []
            while(st.length) {
                z = st.pop()
                if(z.length === 1) 
                    if(z === "#" || T.includes(z)) 
                        if(!b.includes(z)) {
                            b.push( z )
                            continue
                        }
                if(T.includes(z[0])) {
                    if(!b.includes(z))
                        b.push( z )
                    continue
                }
                for(i=0;i<pr[z[0]].length;i++) {
                    st.push(pr[z[0]][i])
                }
                if(z.length > 1)
                    st1.push(z.slice(1))
                continue;
            }
            for(i=0;i<b.length;i++) {
                if(b[i] !== '#' && !c.includes(b[i])) {
                    c.push(b[i])
                }
            }
            if(b.includes('#')) {
                if(st1.length) {
                    st.push(st1.pop())
                    continue
                }
                c.push('#')
            }
            break
        }
        return c
    }
    
    function follow(qq) {
        q = [ qq ] 
        var st = [ qq ]
        b = []
        while(st.length) {
            a = st.pop()
            for(i=0;i<NT.length;i++) {
                for(j=0;j<pr[NT[i]].length;j++) {
                    for(zz=0;zz<pr[NT[i]][j].length;zz++) {
                        if (pr[NT[i]][j][zz] === a && zz<pr[NT[i]][j].length-1) {
                            c = first( pr[NT[i]][j].slice(zz+1) )
                            for(cc=0;cc<c.length;cc++) {
                                if(!b.includes(c[cc]))
                                    b.push(c[cc])
                            }
                        }
                        else if (pr[NT[i]][j][zz] === a && zz === pr[NT[i]][j].length-1) {
                            if(NT[i]=='S!') {
                                b.push('$')
                                continue
                            }
                            if (!st.includes(NT[i])) {
                                st.push(NT[i])
                            }   
                        }
                    }
                }
            }
        }
        if (b.includes('#'))
            b[b.indexOf('#')]='$'
        return b
    }

    NT.slice(1).map(i => {
        q1[i]=first(i)
        q2[i]=follow(i)
    })
    
    q2['S!'] = ['$']

    q1['S!'] = q1['S']

    console.log("First :",q1)
    console.log("Follow :",q2)

    q=[ ...T ]
    

    q.push('$')

    tab = {}
    NT.map(i => {
        tab[i] = {}
        q.map(j => {
            tab[i][j]=""
        })

    })

    NT.map(i => {
        q1[i].map(j => {
            pr[i].map(z => {
                b = first(z)
                if (b.includes(j)) {
                    if(j==='#')
                        j='$' 
                    console.log("tab[i][j] :",tab[i][j])
                    if(tab[i][j]==="") {
                        tab[i][j]=i+" -> "+z
                        return
                    }
                    tab[i][j]=tab[i][j]+" , "+i+" -> "+z
                }
            })
        })
    })

    console.log(tab)         


    s="<div class=\"titlespace\"><h1 id=\"title1\">LL(0)</h1></div><div id=\"outbox1\"><div id=\"firstfollow\"><div class=\"absline\"></div><div class=\"titles\"><div class=\"ftitle2\"><h4 class=\"ftitle1\">FIRST</h4></div><div class=\"ftitle2\"><h4 class=\"ftitle1\">FOLLOW</h4></div></div><div class=\"lists\"><ul class=\"list\">"
    
    NT.map(i => {
        s+="<li>"+i+" : "+q1[i][0]
        q1[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul><ul class=\"list\">"

    NT.map(i => {
        s+="<li>"+i+" : "+q2[i][0]
        q2[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul></div></div>"

    s+="<table id=\"table1\"><caption>LL(0) Table</caption><tr><th id=\"table1h1\"></th>"
    T.map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h2\">$</th>"

    s+="</tr>"

    NT.slice(0,NT.length-1).map(i => {
        s+="<tr><th>"+i+"</th>"
        Object.values(tab[i]).map(j => {
            s+="<td>"+j+"</td>"
        })
        s+="</tr>"
    })
    s+="<tr><th id=\"table1h3\">"+NT[NT.length-1]+"</th>"
    Object.values(tab[NT[NT.length-1]]).slice(0,T.length).map(j => {
        s+="<td>"+j+"</td>"
    })
    s+="<td id=\"table1h4\">"+tab[NT[NT.length-1]]['$']+"</td>"
    s+="</tr></table>"

    if(inp.length === 0) {
        s+="</div>"
        console.log(s)
        return s
    }

    st=[]
    st.push(NT[0])

    var tabinp =[]    

    i=0
    while( i < inp.length ) {
        q=inp[i]

        if( st.length === 0) {
            console.log("The Input String is not Accepted by the Grammer")
            console.log(tabinp)
            break
        }

        if ( !T.includes(q) ) {
            console.log("The Input String is not Accepted by the Grammer")
            console.log(tabinp)
            break
        }

        if(T.includes(st[st.length-1])) {
            if(st[st.length-1]==inp[i]) {
                i+=1
                st.pop()
                continue
            }
        }

        if(NT.includes( st[st.length-1] )) {
            if(tab[ st[st.length-1] ][q] === "") {
                if(tab[ st[st.length-1] ]['$'] !== "") {
                    qq=st[-1]
                    qqq=""
                    st.reverse()
                    st.map(j => {
                        qqq+=j
                    })
                    st.reverse()
                    st.pop()
                    row={'Stack':qqq+'$','Input':inp.slice(i),'Production':tab[qq]['$']}
                    tabinp = tabinp.push(row)
                    continue
                }
                console.log("The Input String is not Accepted by the Grammer")
                console.log(tabinp)
                break
            }
            qq=st[st.length-1]
            qqq=""
            st.reverse()
            st.map(j => {
                qqq+=j
            })
            st.reverse()
            st.pop()
            if(tab[qq][q][ tab[qq][q].length-1 ]!='#') {
                for ( j = tab[qq][q].length-1 ; j > tab[qq][q].indexOf('>')+1 ; j-- )
                    st.push(tab[qq][q][j])
            }
            row={'Stack':qqq+'$','Input':inp.slice(i),'Production':tab[qq][q]}
            tabinp.push(row)
            continue
        }

        break
    }

    qqq=""
    
    while(st.length) {
        st.reverse()
        st.map(j => {
            qqq+=j
        })
        st.reverse()
        if( pr[st[st.length-1]].includes('#') ) {
            row={'Stack':qqq+'$','Input':"",'Production':st[st.length-1]+" -> "+"#"}
            tabinp.push(row)
            st.pop() 
            continue
        }
        row={'Stack':qqq+'$','Input':"",'Production':""}
        tabinp = tabinp.push(row)  
        console.log("The Input String is not Accepted by the Grammer")
        console.log(tabinp)
        break
    }
        

    console.log(tabinp)

    s+="<div id=\"parsing\"><table id=\"table1\" id=\"table\"><caption>Parsing the Input String</caption>"
    s+="<tr><th id=\"table1h1\"></th><th>Stack</th><th>Input</th><th id=\"table1h2\">Production</th></tr>"
    
    if(tabinp.length) {
        for (i=0;i<tabinp.length-1;i++) {
            s+="<tr><th>"+i.toString()+"</th>"
            Object.values(tabinp[i]).map(j => {
                s+="<td>"+j+"</td>"
            })
            s+="</tr>"
        }
        s+="<tr><th id=\"table1h3\">"+(tabinp.length-1).toString()+"</th>"
        Object.values(tabinp[tabinp.length-1]).slice(0,2).map(j => {
            s+="<td>"+j+"</td>"
        })
        s+="<td id=\"table1h4\">"+tabinp[tabinp.length-1]["Production"]+"</td>"
        s+="</tr></table>"
    }

    if( st.length === 0 ) {
        s+="<li id=\"parseresult\">The Input String is Accepted by the Grammar</li></div></div>"
        console.log("The Input String is Accepted by the Grammer")
        return s
    }
    s+="<li id=\"parseresult\">The Input String is Not Accepted by the Grammar</li></div></div>"
    console.log("The Input String is Not Accepted by the Grammer")
    console.log(s)
    return s
}

function generatell1(pr2,inp) {   
    var pr3 = pr2.split(' ').join('')
    pr={}

    var pr3Array = pr3.split('\n')
    var i , j , z , a , b , zz , cc , row , q 
    for ( i=0; i<pr3Array.length; i++ ) {
        j = pr3Array[i].split('->')
        q = j[1].split(',')
        pr[j[0]]=q
    }
    //pr={'S!':['S'],'S':['ABC'],'A':['a','#'],'B':['b','#'],'C':['c','#']}

    var NT=Object.keys(pr)
    console.log(NT)
    var T=[]

    NT.map((i) => {
        pr[i].map((j) => {
            for(z=0;z<j.length;z++) {
                if(j.charCodeAt(z) >= 97 && j.charCodeAt(z) <= 122 && !T.includes(j[z])) 
                    T.push(j[z])
            }
        })
    })

    console.log("Production Rules :",pr)
    console.log("Non-Terminals :",NT)
    console.log("Terminals :",T)
    //return
    var q1={}
    var q2={}

    function first (a) {
        c = []
        var st = [ a ]
        var st1 = []
        while(true) {
            b = []
            while(st.length) {
                z = st.pop()
                if(z.length === 1) 
                    if(z === "#" || T.includes(z)) 
                        if(!b.includes(z)) {
                            b.push( z )
                            continue
                        }
                if(T.includes(z[0])) {
                    if(!b.includes(z))
                        b.push( z )
                    continue
                }
                for(i=0;i<pr[z[0]].length;i++) {
                    st.push(pr[z[0]][i])
                }
                if(z.length > 1)
                    st1.push(z.slice(1))
                continue;
            }
            for(i=0;i<b.length;i++) {
                if(b[i] !== '#' && !c.includes(b[i])) {
                    c.push(b[i])
                }
            }
            if(b.includes('#')) {
                if(st1.length) {
                    st.push(st1.pop())
                    continue
                }
                c.push('#')
            }
            break
        }
        return c
    }
    
    function follow(qq) {
        q = [ qq ] 
        var st = [ qq ]
        b = []
        while(st.length) {
            a = st.pop()
            for(i=0;i<NT.length;i++) {
                for(j=0;j<pr[NT[i]].length;j++) {
                    for(zz=0;zz<pr[NT[i]][j].length;zz++) {
                        if (pr[NT[i]][j][zz] === a && zz<pr[NT[i]][j].length-1) {
                            c = first( pr[NT[i]][j].slice(zz+1) )
                            for(cc=0;cc<c.length;cc++) {
                                if(!b.includes(c[cc]))
                                    b.push(c[cc])
                            }
                        }
                        else if (pr[NT[i]][j][zz] === a && zz === pr[NT[i]][j].length-1) {
                            if(NT[i]=='S!') {
                                b.push('$')
                                continue
                            }
                            if (!st.includes(NT[i])) {
                                st.push(NT[i])
                            }   
                        }
                    }
                }
            }
        }
        if (b.includes('#'))
            b[b.indexOf('#')]='$'
        return b
    }

    NT.slice(1).map(i => {
        q1[i]=first(i)
        q2[i]=follow(i)
    })

    
    q2['S!'] = ['$']

    q1['S!'] = q1['S']

    console.log("First :",q1)
    console.log("Follow :",q2)

    q=[ ...T ]
    

    q.push('$')

    tab = {}
    NT.map(i => {
        tab[i] = {}
        q.map(j => {
            tab[i][j]=""
        })

    })

    var conflicts=[]
    
    NT.map(i => {
        q1[i].map(j => {
            pr[i].map(z => {
                b = first(z)
                if (b.includes(j)) {
                    if(j==='#')
                        j='$' 
                    console.log("tab[i][j] :",tab[i][j])
                    if(tab[i][j]==="") {
                        tab[i][j]=i+" -> "+z
                        return
                    }
                    console.log("[i,j]",[i,j])
                    conflicts.push([i,j])
                    tab[i][j]=tab[i][j]+" , "+i+" -> "+z
                }
            })
        })
    })

    console.log("Conflicts :",conflicts)
    console.log(tab)        

    s="<div class=\"titlespace\"><h1 id=\"title1\">LL(1)</h1></div><div id=\"outbox1\"><div id=\"firstfollow\"><div class=\"absline\"></div><div class=\"titles\"><div class=\"ftitle2\"><h4 class=\"ftitle1\">FIRST</h2></div><div class=\"ftitle2\"><h4 class=\"ftitle1\">FOLLOW</h2></div></div><div class=\"lists\"><ul class=\"list\">"
    
    NT.map(i => {
        s+="<li>"+i+" : "+q1[i][0]
        q1[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul><ul class=\"list\">"

    NT.map(i => {
        s+="<li>"+i+" : "+q2[i][0]
        q2[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul></div></div>"

    s+="<table id=\"table1\"><caption>LL(1) Table</caption><tr><th id=\"table1h1\"></th>"
    
    T.map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h2\">$</th>"

    s+="</tr>"

    NT.slice(0,NT.length-1).map(i => {
        s+="<tr><th>"+i+"</th>"
        Object.values(tab[i]).map(j => {
            s+="<td>"+j+"</td>"
        })
        s+="</tr>"
    })
    s+="<tr><th id=\"table1h3\">"+NT[NT.length-1]+"</th>"
    Object.values(tab[NT[NT.length-1]]).slice(0,T.length).map(j => {
        s+="<td>"+j+"</td>"
    })
    s+="<td id=\"table1h4\">"+tab[NT[NT.length-1]]['$']+"</td>"
    s+="</tr></table>"

    console.log("Conflicts : ",conflicts)
    s+="<div id=\"conflicts\"><h3>Conflicts</h3><ul>"
    if(conflicts.length>0) {
        console.log("Conflicts Exist")
        console.log("The Grammer is not an LL(1) grammer")

        conflicts.map(i => {
            s+="<li>"+i[0]+"->"+i[1]+"</li>"
        })
        s+="</ul></div>"
        return s
    }
    s+="<li>No Conflicts Exists</li>"
    s+="</ul></div>"

    if(inp.length === 0) {
        s+="</div>"
        console.log(s)
        return s
    }

    st=[]
    st.push(NT[0])


    //tabinp = pd.DataFrame(columns=['Stack','Input','Production'])
    var tabinp =[] 

    i=0 
    var zq=0

    while( i < inp.length ) {
        q=inp[i]

        if( st.length === 0 || !T.includes(q) ) {
            zq=1
            break
        }

        if ( T.includes(st[st.length - 1]) ) {
            if(st[st.length - 1] === inp[i]) {
                zq=1
                break
            }
        }

        if(T.includes(st[st.length-1])) {
            if(st[st.length-1]==inp[i]) {
                i+=1
                st.pop()
                continue
            }
        }

        if(NT.includes( st[st.length-1] )) {
            if(tab[ st[st.length-1] ][q] === "") {
                if(tab[ st[st.length-1] ]['$'] !== "") {
                    qq=st[-1]
                    qqq=""
                    st.reverse()
                    st.map(j => {
                        qqq+=j
                    })
                    st.reverse()
                    st.pop()
                    row={'Stack':qqq+'$','Input':inp.slice(i),'Production':tab[qq]['$']}
                    tabinp.push(row)
                    continue
                }
                zq=1
                break
            }
            qq=st[st.length-1]
            qqq=""
            st.reverse()
            st.map(j => {
                qqq+=j
            })
            st.reverse()
            st.pop()
            if(tab[qq][q][ tab[qq][q].length-1 ]!='#') {
                for ( j = tab[qq][q].length-1 ; j > tab[qq][q].indexOf('>')+1 ; j-- )
                    st.push(tab[qq][q][j])
            }
            row={'Stack':qqq+'$','Input':inp.slice(i),'Production':tab[qq][q]}
            tabinp.push(row)
            continue
        }

        break
    }

    qqq=""
    while(st.length) {
        st.reverse()
        st.map(j => {
            qqq+=j
        })
        st.reverse()
        console.log("pr :",pr)
        console.log("st :",st)
        if( pr[st[st.length-1]] && pr[st[st.length-1]].includes('#') ) {
            row={'Stack':qqq+'$','Input':"",'Production':st[st.length-1]+" -> "+"#"}
            tabinp.push(row)
            st.pop() 
            continue
        }
        row={'Stack':qqq+'$','Input':"",'Production':""}
        tabinp.push(row)  
        console.log("The Input String is not Accepted by the Grammer")
        console.log(tabinp)
        zq = 1
        break
    }

    console.log(tabinp)

    s+="<div id=\"parsing\"><table id=\"table1\" id=\"table\"><caption>Parsing the Input String</caption>"
    s+="<tr><th id=\"table1h1\"></th><th>Stack</th><th>Input</th><th id=\"table1h2\">Production</th></tr>"
    
    for (i=0;i<tabinp.length-1;i++) {
        s+="<tr><th>"+i.toString()+"</th>"
        Object.values(tabinp[i]).map(j => {
            s+="<td>"+j+"</td>"
        })
        s+="</tr>"
    }
    s+="<tr><th id=\"table1h3\">"+(tabinp.length-1).toString()+"</th>"
    Object.values(tabinp[tabinp.length-1]).slice(0,2).map(j => {
        s+="<td>"+j+"</td>"
    })
    s+="<td id=\"table1h4\">"+tabinp[tabinp.length-1]["Production"]+"</td>"
    s+="</tr></table>"

    if(zq) {
        s+="<li id=\"parseresult\">The Input String is Not Accepted by the Grammar</li></div></div>"
        console.log("The Input String is Not Accepted by the Grammer")
        return s
    }
    
    if( st.length === 0 ) {
        s+="<li id=\"parseresult\">The Input String is Accepted by the Grammar</li></div></div>"
        console.log("The Input String is Accepted by the Grammer")
        return s
    }
    s+="<li id=\"parseresult\">The Input String is Not Accepted by the Grammar</li></div></div>"
    console.log("The Input String is Not Accepted by the Grammer")
    console.log(s)
    return s
}

function generatelr0(pr2,inp) { 
    //pr2 = "S!->S\nS->ABC\nA->a,#\nB->b,#\nC->c,#"
    //pr2 = "S!->S\nS->Aa\nA->a"
    //inp = "ab"
    var pr = generatepr(pr2)
    //pr={'S!':['S'],'S':['ABC'],'A':['a','#'],'B':['b','#'],'C':['c','#']}
    var i , j , z , a , b , zz , zzz , cc , row , q
    var NT=Object.keys(pr)
    var T=generateTerminals(pr)

    console.log("Production Rules :",pr)
    console.log("Non-Terminals :",NT)
    console.log("Terminals :",T)
    //return

    var pr1 = generatepr1( pr )

    console.log(pr1)

    var q1={}
    var q2={}

    NT.slice(1).map(i => {
        q1[i]=first(i,T,pr)
        q2[i]=follow(i,NT,T,pr)
    })

    q2['S!'] = ['$']

    q1['S!'] = q1['S']

    console.log("First :",q1)
    console.log("Follow :",q2)

    sta=[]
    st1={}
    q=NT[0]
    st1[q]=pr[q]
    st=[]
    trz={}
    stz=[]
    zz={}
    zzz={}
    
    trz={}
    trz[0]=[]
    for(i=0;i<st1[q].length;i++) {
        if (st1[q][i].length > 1) {
            if(st1[q][i].slice(0,2)==NT[0]) {
                stz.push(NT[0])
                trz[0].push(NT[0])
                st1[q][i]='.'+st1[q][i]
                continue
            }
        }
        if ( st1[q][i][0] === st1[q][i][0].toUpperCase() ) {
            stz.push(st1[q][i][0])
            trz[0].push(st1[q][i][0])
        }
        st1[q][i]='.'+st1[q][i]
    }

    while( stz.length > 0 ) {
        q=stz.pop()
        console.log("q :",q)
        if ( !Object.keys(st1).includes(q) ) {
            if(!pr[q])
                st1[q] = []
            else   
                st1[q]=pr[q]
            for( j=0;j<st1[q].length;j++ ) { 
                if ( st1[q][j][0] >= 'A' && st1[q][j][0] <= 'Z' ) 
                    stz.push(st1[q][j][0])
                trz[0].push(st1[q][j][0])
                st1[q][j]='.'+st1[q][j]
            }
        }
    }
    stn=2

    stnz=[]
    stnz.push(0)
    sta.push(st1)
    st.push(0)

    st4={ [ NT[0] ] : [ NT[1] + '.' ] }
    sta.push(st4)
    zz[0]={}
    zz[0][NT[1]]=1

    while(st.length>0) {
        zx=st.pop()
        st2=sta[zx]
        stz=[]
        trz[zx].map(i => {
            st3={}
            trz[stn]=[]
            zq=[]
            Object.keys(st2).map(j => {
                st2[j].map(z => {
                    x=z.indexOf('.')
                    if(x < z.length-1) {
                        if ( z[x+1] === i ) {
                            if ( !Object.keys(st3).includes(j) ) {
                                st3[j]=[]
                            }
                            st3[j].push( z.slice(0,x)+z[x+1]+'.'+z.slice(x+2) )
                            if ( x+2 < z.length ) {
                                if( NT.includes(z[x+2]) )
                                    stz.push(z[x+2])
                                if ( !trz[stn].includes(z[x+2]) )
                                    trz[stn].push(z[x+2])
                                return
                            }
                            if(j=='S!'){
                                zq.push('accept')
                                return
                            }
                            qqqq=1 
                            Object.keys(pr).slice(1).map(qz => {
                                pr[qz].map(zqq => {
                                    if( (zqq[0] == '.' && zqq.slice(1) === st3[j][st3[j].length-1].slice(0,st3[j][st3[j].length-1].length-1) ) || zqq==st3[j][st3[j].length-1].slice(0,st3[j][st3[j].length-1].length-1) ) {
                                        if(qz === j)
                                            zq.push(qqqq)
                                    }
                                    qqqq+=1
                                })
                            })
                            return
                        }
                    }
                })
            })

            xz={}
            stz.map(j => {
                xz[j]=[]
                pr[j].map(z => {
                    xz[j].push("."+z)
                    if( NT.includes(z[0]) )
                        stz.push(z[0])
                    if( z.length > 0 )
                        if(!trz[stn].includes(z[0]))
                            trz[stn].push(z[0])
                })
            })
            while( stz.length > 0 ) {
                q=stz.pop()
                if( !Object.keys(xz).includes(q) ) {
                    xz[q]=pr[q]
                    for(j=0;j<xz[q].length;j++) {
                        if ( xz[q][j][0] !== "#" ) 
                            stz.push(xz[q][j][0]) 
                        if( !trz[stn].includes(xz[q][j][0]) ) 
                            trz[stn].push(xz[q][j][0])
                        xz[q][j]='.'+xz[q][j]
                    }
                }
            }
            
            Object.keys(xz).map(j => {
                if ( Object.keys(st3).includes(j) ) {
                    xz[j].map(z => {
                        st3[j].push(z)
                    })
                    return
                }
                st3[j]=xz[j] 
            })

            qqq=0

            for( qq = 0; qq<sta.length; qq++) {
                if( JSON.stringify(sta[qq]) === JSON.stringify(st3) ) {
                    if( !zz[zx] ) {
                        zz[zx]={}
                    }
                    zz[zx][i]=qq
                    qqq=1
                    break
                }
            }
            if(qqq==1)
                return

            sta.push(st3)
            st.push(stn)
            if(zq.length)
                zzz[stn]=zq
            if( !zz[zx] )
                zz[zx]={}
            zz[zx][i]=stn
            stn+=1
            return
        })
    }
        

    console.log("States :")
    j=0
    
    sta.map(i => {
        console.log(j,":",i)
        j+=1
    })
    /*
    var qqq=sorted(zz.keys())
    console.log("Transitions : {",end="")
    qqq.map( i=> {
        console.log( i.toString() ,":", zz[i].toString() ,end="")
        if(i !== qqq.length-1)
            console.log(" ,",end=" ")
    })
    console.log("}")*/
    console.log("Transitions :",zz)
    console.log("Reductions :",zzz)

    console.log("zz :",zz)

    var tdf={}

    T.map(i => {
        tdf[i]={}
        for( j=0; j<sta.length; j++ ) {
            tdf[i][j]=[-1,[]]
        }
    })

    NT.map(i => {
        tdf[i]={}
        for( j=0;j<sta.length;j++ )
            tdf[i][j]=[-1,[]]
    })
    
    tdf['$']={}
    
    for( j=0;j<sta.length;j++ )
        tdf['$'][j]=[-1,[]]
    Object.keys(zz).map( i=> {
        Object.keys(zz[i]).map( j => {
            if(j === '#') {
                tdf['$'][i][0]=zz[i][j]
                return
            }
            tdf[j][i][0]=zz[i][j]
        })
    })
    
    Object.keys(zzz).map(i => {
        T.map(z => {
            zzz[i].map(j => {
                tdf[z][i][1].push(j)
            })
        })
        NT.map(z => {
            zzz[i].map(j => {
                tdf[z][i][1].push(j)
            })
        })
    })

    Object.keys(zzz).map( i => {
        zzz[i].map(j => {
            tdf['$'][i][1].push(j)
        })
    })

    console.log("tdf :",tdf)
    console.log("tdf['C'] :",tdf['C'])

    c=NT.length+T.length
    zqqq=[]
    
    zqqq.push(...T)
    
    NT.map(i => {
        if( i !== 'S!' ) {
            zqqq.push(i)
            return
        }
        zqqq.push('$')
    })

    tab = {}

    for(i=0;i<sta.length;i++)
        tab[i] = {}

    console.log("tab :",tab)

    sc={}
    rc=[]

    Object.keys(tdf).map(i => {
        Object.keys(tdf[i]).map(j => {
            if(tdf[i][j][0] !== -1)
                x='S'+ tdf[i][j][0].toString()
            else
                x=""
            if ( (T.includes(i)) || ( i==='$') ) 
                tdf[i][j][1].map(z => {
                        if(x.length === 0) {
                            x+='R'+z.toString()
                            return
                        }
                        x+=',R'+z.toString()
                })
                
            var count = 0
            if( x.includes('R') && x.includes('S') ) {
                sc[j]={}
                sc[j]['S'] = 0
                sc[j]['R'] = 0
                for(z=0;z<x.length;z++)
                    if(['S','R'].includes(x[z]))
                        sc[j][x[z]] += 1
            }
            for(z=0;z<x.length;z++)
                    if(['R'].includes(x[z]))
                        count += 1
            if(count>1)
                rc[j]=count

            tab[j][i]=x 
        })
    })
    tab[1]['$']='accept'
    tdf['$'][1][0]=-2
    console.log(tab)
    console.log("SR - Conflicts :",sc)
    console.log("RR - Conflicts :",rc)

    s="<div class=\"titlespace\"><h1 id=\"title1\">LR(0)</h1></div><div id=\"outbox1\"><div id=\"firstfollow\"><div class=\"absline\"></div><div class=\"titles\"><div class=\"ftitle2\"><h4 class=\"ftitle1\">FIRST</h4></div><div class=\"ftitle2\"><h4 class=\"ftitle1\">FOLLOW</h4></div></div><div class=\"lists\"><ul class=\"list\">"
    
    Object.keys(q1).map(i => {
        s+="<li>"+i+" : "+q1[i][0]
        q1[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul><ul class=\"list\">"

    Object.keys(q2).map(i => {
        s+="<li>"+i+" : "+q2[i][0]
        q2[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })

    s+="</ul></div></div>"
    
    
    s+="<div id=\"states\"><div id=\"titles12\"><h3>States</h3></div><div id=\"states1\">"
    
    
    j=0
    sta.map(i=> {
        s+="<div class=\"state\"><div class=\"titles11\"><h4>State "+j.toString()+"</h4></div>"
        j+=1
        Object.keys(i).map(q => {
            s+="<div class=\"item\"><div class=\"LHS\"><div class=\"LHS1\">"+q+"</div></div>"
            s+="<div class=\"RHS\"><div class=\"RHS1\">"
            i[q].slice(0,i[q].length-1).map(x => {
                s+=x+","
            })
            s+=i[q][i[q].length-1]
            s+="</div></div></div>"
        })
        s+="</div>"
    })
    s+="</div></div>"

    s+="<table id=\"table1\"><caption>LR(0) Table</caption><tr><th id=\"table1h1\"></th>"
    T.map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h2\">$</th>"
    NT.slice(1,NT.length-1).map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h5\">"+NT[NT.length-1]+"</th>"
    s+="</tr>"
    
    for(i=0;i<sta.length-1;i++) {
        s+="<tr><th>"+i.toString()+"</th>"
        /*Object.values(tab[i]).map(j => {
            s+="<td>"+j+"</td>"
        })*/
        T.map(j => {
            s+="<td>"+tab[i][j]+"</td>"
        })
        s+="<td>"+tab[i]['$']+"</td>"
        NT.slice(1).map(j => {
            s+="<td>"+tab[i][j]+"</td>"
        })
        s+="</tr>"
    }
    s+="<tr><th id=\"table1h3\">"+(sta.length-1).toString()+"</th>"
    T.map(j => {
        s+="<td>"+tab[sta.length-1][j]+"</td>"
    })
    s+="<td>"+tab[sta.length-1]['$']+"</td>"
    NT.slice(1,NT.length-1).map(j => {
        s+="<td>"+tab[sta.length-1][j]+"</td>"
    })
    s+="<td id=\"table1h4\">"+tab[sta.length-1][NT[NT.length-1]]+"</td>"
    s+="</tr></table>"

    s+="<div id=\"conflicts1\"><h3>Conflicts</h3><div id= \"conflictslist\"><div class=\"absline1\"></div>"
    s+="<div class=\"titles1\"><div class=\"ftitle21\"><h5 class=\"ftitle11\">SR-CONFLICTS</h5></div><div class=\"ftitle21\"><h5 class=\"ftitle11\">RR-CONFLICTS</h5></div></div>"

    if( sc.length+rc.length > 0 ) {
        s+="<div class=\"lists1\"><ul class=\"list1\">"
        Object.keys(sc).map(i => {
            s+="<li>"+i+" : "+q1[i][0]
            q1[i].slice(1).map(j => {
                s+=","+j
            })
            s+="</li>"
        })
        s+="</ul><ul class=\"list1\">"

        rc.map(i => {
            s+="<li>"+i+"</li>"
        })
        s+="</ul></div></div></div>"

        console.log("The Given Grammer is Not an LR(0) Grammar.")
        s+="<h4>The Given Grammar is Not an LR(0) Grammar</h4></div>"
        return s
    }

    s+="<div class=\"lists1\"><ul class=\"list1\"><li>No SR-Conflicts Exists</li></ul><ul class=\"list1\"><li>No RR-Conflicts Exists</li></ul></div></div><h4>The Given Grammar is an LR(0) Grammar</h4></div>"
    if( inp.length === 0) {
        s+="</div>"
        return s
    }

    parselrtable(inp , tdf , pr1 , NT , T , s)    

    if(qq===0) {
        if( st.length === 0) {
            s+="<div id=\"inpout\">The Input String is Accepted by the Grammer</div>"
            console.log("The Input String is Accepted by the Grammer")
        }
        else {
            s+="<div id=\"inpout\">The Input String is Not Accepted by the Grammer</div>"
            console.log("The Input String is Not Accepted by the Grammer")
        }
    }
    else
        s+="<div id=\"inpout\">The Input String is Accepted by the Grammer</div>"
    s+="</div>"
    return s
}

function generateslr1(pr2,inp) { 
    //pr2 = "S!->S\nS->ABC\nA->a,#\nB->b,#\nC->c,#"
    //pr2 = "S!->S\nS->Aa\nA->a"
    //inp = "ab"
    var pr = generatepr(pr2)
    //pr={'S!':['S'],'S':['ABC'],'A':['a','#'],'B':['b','#'],'C':['c','#']}
    var i , j , z , a , b , zz , zzz , cc , row , q
    var NT=Object.keys(pr)
    var T=generateTerminals(pr)

    console.log("Production Rules :",pr)
    console.log("Non-Terminals :",NT)
    console.log("Terminals :",T)
    //return

    var pr1 = generatepr1( pr )

    console.log(pr1)

    var q1={}
    var q2={}

    NT.slice(1).map(i => {
        q1[i]=first(i,T,pr)
        q2[i]=follow(i,NT,T,pr)
    })

    q2['S!'] = ['$']

    q1['S!'] = q1['S']

    console.log("First :",q1)
    console.log("Follow :",q2)

    sta=[]
    st1={}
    q=NT[0]
    st1[q]=pr[q]
    st=[]
    trz={}
    stz=[]
    zz={}
    zzz={}
    
    trz={}
    trz[0]=[]
    for(i=0;i<st1[q].length;i++) {
        if (st1[q][i].length > 1) {
            if(st1[q][i].slice(0,2)==NT[0]) {
                stz.push(NT[0])
                trz[0].push(NT[0])
                st1[q][i]='.'+st1[q][i]
                continue
            }
        }
        if ( st1[q][i][0] === st1[q][i][0].toUpperCase() ) {
            stz.push(st1[q][i][0])
            trz[0].push(st1[q][i][0])
        }
        st1[q][i]='.'+st1[q][i]
    }

    while( stz.length > 0 ) {
        q=stz.pop()
        console.log("q :",q)
        if ( !Object.keys(st1).includes(q) ) {
            if(!pr[q])
                st1[q] = []
            else   
                st1[q]=pr[q]
            for( j=0;j<st1[q].length;j++ ) { 
                if ( st1[q][j][0] >= 'A' && st1[q][j][0] <= 'Z' ) 
                    stz.push(st1[q][j][0])
                trz[0].push(st1[q][j][0])
                st1[q][j]='.'+st1[q][j]
            }
        }
    }
    stn=2

    stnz=[]
    stnz.push(0)
    sta.push(st1)
    st.push(0)

    st4={ [ NT[0] ] : [ NT[1] + '.' ] }
    sta.push(st4)
    zz[0]={}
    zz[0][NT[1]]=1

    while(st.length>0) {
        zx=st.pop()
        st2=sta[zx]
        stz=[]
        trz[zx].map(i => {
            st3={}
            trz[stn]=[]
            zq=[]
            Object.keys(st2).map(j => {
                st2[j].map(z => {
                    x=z.indexOf('.')
                    if(x < z.length-1) {
                        if ( z[x+1] === i ) {
                            if ( !Object.keys(st3).includes(j) ) {
                                st3[j]=[]
                            }
                            st3[j].push( z.slice(0,x)+z[x+1]+'.'+z.slice(x+2) )
                            if ( x+2 < z.length ) {
                                if( NT.includes(z[x+2]) )
                                    stz.push(z[x+2])
                                if ( !trz[stn].includes(z[x+2]) )
                                    trz[stn].push(z[x+2])
                                return
                            }
                            if(j=='S!'){
                                zq.push('accept')
                                return
                            }
                            qqqq=1 
                            Object.keys(pr).slice(1).map(qz => {
                                pr[qz].map(zqq => {
                                    if( (zqq[0] == '.' && zqq.slice(1) === st3[j][st3[j].length-1].slice(0,st3[j][st3[j].length-1].length-1) ) || zqq==st3[j][st3[j].length-1].slice(0,st3[j][st3[j].length-1].length-1) ) {
                                        if(qz === j)
                                            zq.push(qqqq)
                                    }
                                    qqqq+=1
                                })
                            })
                            return
                        }
                    }
                })
            })

            xz={}
            stz.map(j => {
                xz[j]=[]
                pr[j].map(z => {
                    xz[j].push("."+z)
                    if( NT.includes(z[0]) )
                        stz.push(z[0])
                    if( z.length > 0 )
                        if(!trz[stn].includes(z[0]))
                            trz[stn].push(z[0])
                })
            })
            while( stz.length > 0 ) {
                q=stz.pop()
                if( !Object.keys(xz).includes(q) ) {
                    xz[q]=pr[q]
                    for(j=0;j<xz[q].length;j++) {
                        if ( xz[q][j][0] !== "#" ) 
                            stz.push(xz[q][j][0]) 
                        if( !trz[stn].includes(xz[q][j][0]) ) 
                            trz[stn].push(xz[q][j][0])
                        xz[q][j]='.'+xz[q][j]
                    }
                }
            }
            
            Object.keys(xz).map(j => {
                if ( Object.keys(st3).includes(j) ) {
                    xz[j].map(z => {
                        st3[j].push(z)
                    })
                    return
                }
                st3[j]=xz[j] 
            })

            qqq=0

            for( qq = 0; qq<sta.length; qq++) {
                if( JSON.stringify(sta[qq]) === JSON.stringify(st3) ) {
                    if( !zz[zx] ) {
                        zz[zx]={}
                    }
                    zz[zx][i]=qq
                    qqq=1
                    break
                }
            }
            if(qqq==1)
                return

            sta.push(st3)
            st.push(stn)
            if(zq.length)
                zzz[stn]=zq
            if( !zz[zx] )
                zz[zx]={}
            zz[zx][i]=stn
            stn+=1
            return
        })
    }
        

    console.log("States :")
    j=0
    
    sta.map(i => {
        console.log(j,":",i)
        j+=1
    })
    /*
    var qqq=sorted(zz.keys())
    console.log("Transitions : {",end="")
    qqq.map( i=> {
        console.log( i.toString() ,":", zz[i].toString() ,end="")
        if(i !== qqq.length-1)
            console.log(" ,",end=" ")
    })
    console.log("}")*/
    console.log("Transitions :",zz)
    console.log("Reductions :",zzz)

    console.log("zz :",zz)

    var tdf={}

    T.map(i => {
        tdf[i]={}
        for( j=0; j<sta.length; j++ ) {
            tdf[i][j]=[-1,[]]
        }
    })

    NT.map(i => {
        tdf[i]={}
        for( j=0;j<sta.length;j++ )
            tdf[i][j]=[-1,[]]
    })
    
    tdf['$']={}
    
    for( j=0;j<sta.length;j++ )
        tdf['$'][j]=[-1,[]]
    Object.keys(zz).map( i=> {
        Object.keys(zz[i]).map( j => {
            if(j === '#') {
                tdf['$'][i][0]=zz[i][j]
                return
            }
            tdf[j][i][0]=zz[i][j]
        })
    })
    
    Object.keys(zzz).map(i => {
            zzz[i].map(j => {
                q2[pr1[j][0]].map(z => {
                    tdf[z][i][1].push(j)
                })
            })
    })

    console.log("tdf :",tdf)
    console.log("tdf['C'] :",tdf['C'])

    c=NT.length+T.length
    zqqq=[]
    
    zqqq.push(...T)
    
    NT.map(i => {
        if( i !== 'S!' ) {
            zqqq.push(i)
            return
        }
        zqqq.push('$')
    })

    tab = {}

    for(i=0;i<sta.length;i++)
        tab[i] = {}

    console.log("tab :",tab)

    sc={}
    rc=[]

    Object.keys(tdf).map(i => {
        Object.keys(tdf[i]).map(j => {
            if(tdf[i][j][0] !== -1)
                x='S'+ tdf[i][j][0].toString()
            else
                x=""
            if ( (T.includes(i)) || ( i==='$') ) 
                tdf[i][j][1].map(z => {
                        if(x.length === 0) {
                            x+='R'+z.toString()
                            return
                        }
                        x+=',R'+z.toString()
                })
                
            var count = 0
            if( x.includes('R') && x.includes('S') ) {
                sc[j]={}
                sc[j]['S'] = 0
                sc[j]['R'] = 0
                for(z=0;z<x.length;z++)
                    if(['S','R'].includes(x[z]))
                        sc[j][x[z]] += 1
            }
            for(z=0;z<x.length;z++)
                    if(['R'].includes(x[z]))
                        count += 1
            if(count>1)
                rc[j]=count

            tab[j][i]=x 
        })
    })
    tab[1]['$']='accept'
    tdf['$'][1][0]=-2
    console.log(tab)
    console.log("SR - Conflicts :",sc)
    console.log("RR - Conflicts :",rc)

    s="<div class=\"titlespace\"><h1 id=\"title1\">LR(0)</h1></div><div id=\"outbox1\"><div id=\"firstfollow\"><div class=\"absline\"></div><div class=\"titles\"><div class=\"ftitle2\"><h4 class=\"ftitle1\">FIRST</h4></div><div class=\"ftitle2\"><h4 class=\"ftitle1\">FOLLOW</h4></div></div><div class=\"lists\"><ul class=\"list\">"
    
    Object.keys(q1).map(i => {
        s+="<li>"+i+" : "+q1[i][0]
        q1[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })
    s+="</ul><ul class=\"list\">"

    Object.keys(q2).map(i => {
        s+="<li>"+i+" : "+q2[i][0]
        q2[i].slice(1).map(j => {
            s+=","+j
        })
        s+="</li>"
    })

    s+="</ul></div></div>"
    
    
    s+="<div id=\"states\"><div id=\"titles12\"><h3>States</h3></div><div id=\"states1\">"
    
    
    j=0
    sta.map(i=> {
        s+="<div class=\"state\"><div class=\"titles11\"><h4>State "+j.toString()+"</h4></div>"
        j+=1
        Object.keys(i).map(q => {
            s+="<div class=\"item\"><div class=\"LHS\"><div class=\"LHS1\">"+q+"</div></div>"
            s+="<div class=\"RHS\"><div class=\"RHS1\">"
            i[q].slice(0,i[q].length-1).map(x => {
                s+=x+","
            })
            s+=i[q][i[q].length-1]
            s+="</div></div></div>"
        })
        s+="</div>"
    })
    s+="</div></div>"

    s+="<table id=\"table1\"><caption>LR(0) Table</caption><tr><th id=\"table1h1\"></th>"
    T.map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h2\">$</th>"
    NT.slice(1,NT.length-1).map(i => {
        s+="<th>"+i+"</th>"
    })
    s+="<th id=\"table1h5\">"+NT[NT.length-1]+"</th>"
    s+="</tr>"
    
    for(i=0;i<sta.length-1;i++) {
        s+="<tr><th>"+i.toString()+"</th>"
        /*Object.values(tab[i]).map(j => {
            s+="<td>"+j+"</td>"
        })*/
        T.map(j => {
            s+="<td>"+tab[i][j]+"</td>"
        })
        s+="<td>"+tab[i]['$']+"</td>"
        NT.slice(1).map(j => {
            s+="<td>"+tab[i][j]+"</td>"
        })
        s+="</tr>"
    }
    s+="<tr><th id=\"table1h3\">"+(sta.length-1).toString()+"</th>"
    T.map(j => {
        s+="<td>"+tab[sta.length-1][j]+"</td>"
    })
    s+="<td>"+tab[sta.length-1]['$']+"</td>"
    NT.slice(1,NT.length-1).map(j => {
        s+="<td>"+tab[sta.length-1][j]+"</td>"
    })
    s+="<td id=\"table1h4\">"+tab[sta.length-1][NT[NT.length-1]]+"</td>"
    s+="</tr></table>"

    s+="<div id=\"conflicts1\"><h3>Conflicts</h3><div id= \"conflictslist\"><div class=\"absline1\"></div>"
    s+="<div class=\"titles1\"><div class=\"ftitle21\"><h5 class=\"ftitle11\">SR-CONFLICTS</h5></div><div class=\"ftitle21\"><h5 class=\"ftitle11\">RR-CONFLICTS</h5></div></div>"

    if( sc.length+rc.length > 0 ) {
        s+="<div class=\"lists1\"><ul class=\"list1\">"
        Object.keys(sc).map(i => {
            s+="<li>"+i+" : "+q1[i][0]
            q1[i].slice(1).map(j => {
                s+=","+j
            })
            s+="</li>"
        })
        s+="</ul><ul class=\"list1\">"

        rc.map(i => {
            s+="<li>"+i+"</li>"
        })
        s+="</ul></div></div></div>"

        console.log("The Given Grammer is Not an LR(0) Grammar.")
        s+="<h4>The Given Grammar is Not an LR(0) Grammar</h4></div>"
        return s
    }

    s+="<div class=\"lists1\"><ul class=\"list1\"><li>No SR-Conflicts Exists</li></ul><ul class=\"list1\"><li>No RR-Conflicts Exists</li></ul></div></div><h4>The Given Grammar is an LR(0) Grammar</h4></div>"
    if( inp.length === 0) {
        s+="</div>"
        return s
    }

    parselrtable(inp , tdf , pr1 , NT , T , s)    

    if(qq===0) {
        if( st.length === 0) {
            s+="<div id=\"inpout\">The Input String is Accepted by the Grammer</div>"
            console.log("The Input String is Accepted by the Grammer")
        }
        else {
            s+="<div id=\"inpout\">The Input String is Not Accepted by the Grammer</div>"
            console.log("The Input String is Not Accepted by the Grammer")
        }
    }
    else
        s+="<div id=\"inpout\">The Input String is Accepted by the Grammer</div>"
    s+="</div>"
    return s
}

var z = -1;
async function Generate () {
    var productionRules = document.getElementById('z1').value
    var inputString = document.getElementById('z2').value
    var newHTML
    switch(z){
        case -1:
            newHTML = "<h2>Choose any parser</h2>"
            break;
        case 1:
            console.log("  z :",z)
            newHTML = generatell0(productionRules,inputString);
            break;
        case 2:
            newHTML = generatell1(productionRules,inputString);
            break;
        case (3):
            newHTML = generatelr0(productionRules,inputString);
            break;
        case (4):
            newHTML = generateslr1(productionRules,inputString);
            break;
            /*
        case (5):
            GenerateSLR1();
            break;
        case (6):
            GenerateCLR1();
            break;
        case (7):
            GenerateLALR1();
            break;
            */
    }
    console.log("newHTML :",newHTML)
    document.getElementById('outbox').innerHTML=newHTML;
}

function setParser(parserIndex,parser) {
    z = parserIndex
    let q=document.getElementsByClassName(".button3");
    q.style.background= "radial-gradient(circle,rgb(1, 0, 54),rgb(12, 0, 180))";
    q.style.color= "white";
    q=document.querySelector("#"+parser);
    q.style.background="radial-gradient(circle,rgb(12, 0, 180),rgb(1, 0, 54))";
    q.style.color="rgb(0, 255, 0)";
}