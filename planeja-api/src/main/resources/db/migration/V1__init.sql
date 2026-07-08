create table usuario (
    id uuid not null primary key,
    login varchar(255) not null unique,
    senha varchar(255) not null,
    nome varchar(255) not null
);

create table categoria (
    id uuid not null primary key,
    nome varchar(255),
    ativo boolean
);

create table cartao (
    id uuid not null primary key,
    nome varchar(30) not null,
    bandeira varchar(255),
    data_cadastro timestamp(6),
    ativo boolean
);

create table lancamento (
    id uuid not null primary key,
    categoria_id uuid not null,
    descricao varchar(255) not null,
    tipo varchar(255) not null,
    data date not null,
    cartao_id uuid,
    valor numeric(15,2) not null
);

alter table lancamento
    add constraint fk_lancamento_categoria
    foreign key (categoria_id) references categoria (id);

alter table lancamento
    add constraint fk_lancamento_cartao
    foreign key (cartao_id) references cartao (id);
